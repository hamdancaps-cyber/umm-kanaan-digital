import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  articles,
  contentBlocks,
  conversionEvents,
  courseEnrollments,
  courses,
  faqs,
  InsertUser,
  leadMagnets,
  lessonProgress,
  lessons,
  learningPaths,
  pathRecommendations,
  purchaseRecords,
  quizAttempts,
  quizQuestions,
  quizzes,
  siteSettings,
  userFavorites,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedLearningPaths() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(learningPaths)
    .where(eq(learningPaths.status, "published"))
    .orderBy(asc(learningPaths.sortOrder));
}

export async function listPublishedArticles() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt));
}

export async function listPublishedFaqs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqs).where(eq(faqs.published, true)).orderBy(asc(faqs.sortOrder));
}

export async function listPublishedLeadMagnets() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(leadMagnets)
    .where(eq(leadMagnets.published, true))
    .orderBy(asc(leadMagnets.sortOrder));
}

export async function listPublishedCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.published, true)).orderBy(asc(courses.title));
}

export async function listUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ enrollment: courseEnrollments, course: courses })
    .from(courseEnrollments)
    .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
    .where(eq(courseEnrollments.userId, userId))
    .orderBy(desc(courseEnrollments.enrolledAt));
}

export async function enrollUserInCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return { saved: false, alreadyEnrolled: false } as const;
  const existing = await db
    .select({ id: courseEnrollments.id })
    .from(courseEnrollments)
    .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, courseId)))
    .limit(1);
  if (existing.length) return { saved: true, alreadyEnrolled: true } as const;
  await db.insert(courseEnrollments).values({ userId, courseId });
  return { saved: true, alreadyEnrolled: false } as const;
}

export async function listUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFavorites).where(eq(userFavorites.userId, userId)).orderBy(desc(userFavorites.createdAt));
}

export async function saveUserFavorite(userId: number, entityType: "path" | "course" | "product" | "article" | "resource", entityKey: string) {
  const db = await getDb();
  if (!db) return { saved: false, alreadySaved: false } as const;
  const existing = await db.select({ id: userFavorites.id }).from(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.entityType, entityType), eq(userFavorites.entityKey, entityKey))).limit(1);
  if (existing.length) return { saved: true, alreadySaved: true } as const;
  await db.insert(userFavorites).values({ userId, entityType, entityKey });
  return { saved: true, alreadySaved: false } as const;
}

export async function listUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchaseRecords).where(eq(purchaseRecords.userId, userId)).orderBy(desc(purchaseRecords.purchasedAt));
}

export async function recordConfirmedPurchase(input: {
  userId: number;
  providerOrderId: string;
  productTitle: string;
  productHandle: string;
  amount: string;
  currencyCode: string;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  await db.insert(purchaseRecords).values({ ...input, accessStatus: "granted" }).onDuplicateKeyUpdate({
    set: { productTitle: input.productTitle, productHandle: input.productHandle, amount: input.amount, currencyCode: input.currencyCode, accessStatus: "granted" },
  });
  return { saved: true } as const;
}

export async function getPublishedCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const courseResult = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.published, true))).limit(1);
  const course = courseResult[0];
  if (!course) return undefined;
  const courseLessons = await db.select().from(lessons).where(and(eq(lessons.courseId, course.id), eq(lessons.published, true))).orderBy(asc(lessons.sortOrder));
  const quizResult = await db.select().from(quizzes).where(and(eq(quizzes.courseId, course.id), eq(quizzes.published, true))).limit(1);
  const quiz = quizResult[0];
  const questions = quiz ? await db.select({ id: quizQuestions.id, prompt: quizQuestions.prompt, optionsJson: quizQuestions.optionsJson, sortOrder: quizQuestions.sortOrder }).from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id)).orderBy(asc(quizQuestions.sortOrder)) : [];
  return { course, lessons: courseLessons, quiz: quiz ? { ...quiz, questions } : null };
}

export async function completeLessonForUser(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return { saved: false, progressPercent: 0 } as const;
  const lessonResult = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  const lesson = lessonResult[0];
  if (!lesson) throw new Error("Lesson not found");
  const existing = await db.select({ id: lessonProgress.id }).from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId))).limit(1);
  if (!existing.length) await db.insert(lessonProgress).values({ userId, lessonId });
  await enrollUserInCourse(userId, lesson.courseId);
  const allLessons = await db.select({ id: lessons.id }).from(lessons).where(and(eq(lessons.courseId, lesson.courseId), eq(lessons.published, true)));
  const completed = await db.select({ lessonId: lessonProgress.lessonId }).from(lessonProgress).where(eq(lessonProgress.userId, userId));
  const completedCount = completed.filter(item => allLessons.some(unit => unit.id === item.lessonId)).length;
  const progressPercent = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  await db.update(courseEnrollments).set({ progressPercent, status: progressPercent === 100 ? "completed" : "enrolled", completedAt: progressPercent === 100 ? new Date() : null }).where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, lesson.courseId)));
  return { saved: true, progressPercent } as const;
}

export async function submitQuizAttempt(userId: number, quizId: number, answers: Array<{ questionId: number; option: number }>) {
  const db = await getDb();
  if (!db) return { saved: false, score: 0, passed: false } as const;
  const quizResult = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  const quiz = quizResult[0];
  if (!quiz) throw new Error("Quiz not found");
  const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  const correct = questions.filter(question => answers.find(answer => answer.questionId === question.id)?.option === question.correctOption).length;
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  const passed = score >= quiz.passScore;
  await db.insert(quizAttempts).values({ userId, quizId, answersJson: JSON.stringify(answers), score, passed });
  return { saved: true, score, passed } as const;
}

export async function recordConversionEvent(input: {
  eventType: string;
  source: string;
  metaJson?: string;
  userId?: number | null;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  await db.insert(conversionEvents).values(input);
  return { saved: true } as const;
}

export async function savePathRecommendation(input: {
  userId?: number | null;
  sessionKey?: string;
  primaryGoal: string;
  answersJson: string;
  recommendedPathSlug: string;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  await db.insert(pathRecommendations).values(input);
  return { saved: true } as const;
}

export async function listSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings).orderBy(asc(siteSettings.settingGroup), asc(siteSettings.settingKey));
}

export async function upsertSiteSetting(input: {
  settingKey: string;
  settingGroup: string;
  value: string;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  await db.insert(siteSettings).values(input).onDuplicateKeyUpdate({
    set: { settingGroup: input.settingGroup, value: input.value },
  });
  return { saved: true } as const;
}

export async function listContentBlocks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contentBlocks).orderBy(asc(contentBlocks.blockKey));
}

export async function getPublishedContentBlock(blockKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(contentBlocks)
    .where(and(eq(contentBlocks.blockKey, blockKey), eq(contentBlocks.published, true)))
    .limit(1);
  return result[0];
}

export async function listAllFaqs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqs).orderBy(asc(faqs.sortOrder));
}

export async function saveFaq(input: {
  id?: number;
  category: string;
  question: string;
  answer: string;
  published: boolean;
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  if (input.id) {
    await db.update(faqs).set({
      category: input.category,
      question: input.question,
      answer: input.answer,
      published: input.published,
      sortOrder: input.sortOrder,
    }).where(eq(faqs.id, input.id));
  } else {
    await db.insert(faqs).values({
      category: input.category,
      question: input.question,
      answer: input.answer,
      published: input.published,
      sortOrder: input.sortOrder,
    });
  }
  return { saved: true } as const;
}

export async function upsertContentBlock(input: {
  blockKey: string;
  title: string;
  body: string;
  metaJson?: string | null;
  published: boolean;
}) {
  const db = await getDb();
  if (!db) return { saved: false } as const;
  await db.insert(contentBlocks).values(input).onDuplicateKeyUpdate({
    set: {
      title: input.title,
      body: input.body,
      metaJson: input.metaJson ?? null,
      published: input.published,
    },
  });
  return { saved: true } as const;
}
