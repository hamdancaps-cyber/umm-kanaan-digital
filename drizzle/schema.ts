import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/** Core identity table managed by the built-in OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Editable site copy, contact values, trainer details and SEO settings. */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 120 }).notNull().unique(),
  settingGroup: varchar("settingGroup", { length: 60 }).notNull().default("general"),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Reusable editorial blocks, including trainer copy and homepage sections. */
export const contentBlocks = mysqlTable("content_blocks", {
  id: int("id").autoincrement().primaryKey(),
  blockKey: varchar("blockKey", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  metaJson: text("metaJson"),
  published: boolean("published").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** The guided paths displayed across the public experience. */
export const learningPaths = mysqlTable("learning_paths", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  shortDescription: varchar("shortDescription", { length: 360 }).notNull(),
  description: text("description").notNull(),
  audience: text("audience").notNull(),
  outcome: text("outcome").notNull(),
  iconName: varchar("iconName", { length: 80 }).notNull().default("Compass"),
  stepPlanJson: text("stepPlanJson"),
  ctaMessage: text("ctaMessage").notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Academy courses may belong to a learning path. */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  pathId: int("pathId").references(() => learningPaths.id, { onDelete: "set null" }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  summary: varchar("summary", { length: 360 }).notNull(),
  description: text("description").notNull(),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  estimatedMinutes: int("estimatedMinutes").notNull().default(60),
  coverImageUrl: text("coverImageUrl"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Lessons are ordered content units inside courses. */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  content: text("content").notNull(),
  lessonType: mysqlEnum("lessonType", ["article", "video", "exercise", "file"]).default("article").notNull(),
  resourceUrl: text("resourceUrl"),
  durationMinutes: int("durationMinutes").notNull().default(10),
  sortOrder: int("sortOrder").notNull().default(0),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Enrollment and truthful course-level progress for signed-in learners. */
export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: int("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["enrolled", "completed"]).default("enrolled").notNull(),
  progressPercent: int("progressPercent").notNull().default(0),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export const lessonProgress = mysqlTable("lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: int("lessonId").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

/** Saved learning paths, resources, and products per authenticated user. */
export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  entityType: mysqlEnum("entityType", ["path", "course", "product", "article", "resource"]).notNull(),
  entityKey: varchar("entityKey", { length: 160 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Local purchase records are written only after a confirmed commerce webhook/order sync. */
export const purchaseRecords = mysqlTable("purchase_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerOrderId: varchar("providerOrderId", { length: 180 }).notNull().unique(),
  productTitle: varchar("productTitle", { length: 255 }).notNull(),
  productHandle: varchar("productHandle", { length: 180 }).notNull(),
  amount: varchar("amount", { length: 32 }).notNull(),
  currencyCode: varchar("currencyCode", { length: 12 }).notNull(),
  accessStatus: mysqlEnum("accessStatus", ["pending", "granted", "revoked"]).default("pending").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

/** Quizzes support a course and/or a path. */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  pathId: int("pathId").references(() => learningPaths.id, { onDelete: "set null" }),
  courseId: int("courseId").references(() => courses.id, { onDelete: "set null" }),
  title: varchar("title", { length: 180 }).notNull(),
  instructions: text("instructions").notNull(),
  passScore: int("passScore").notNull().default(60),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  optionsJson: text("optionsJson").notNull(),
  correctOption: int("correctOption").notNull(),
  explanation: text("explanation"),
  sortOrder: int("sortOrder").notNull().default(0),
});

export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  quizId: int("quizId").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  answersJson: text("answersJson").notNull(),
  score: int("score").notNull(),
  passed: boolean("passed").notNull().default(false),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

/** Free resources and consent-based collection of access details. */
export const leadMagnets = mysqlTable("lead_magnets", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  format: varchar("format", { length: 40 }).notNull().default("guide"),
  fileKey: text("fileKey"),
  ctaLabel: varchar("ctaLabel", { length: 100 }).notNull().default("احصل على الدليل"),
  published: boolean("published").default(false).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const leadClaims = mysqlTable("lead_claims", {
  id: int("id").autoincrement().primaryKey(),
  leadMagnetId: int("leadMagnetId").notNull().references(() => leadMagnets.id, { onDelete: "cascade" }),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 160 }),
  email: varchar("email", { length: 320 }).notNull(),
  consentGiven: boolean("consentGiven").notNull().default(false),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
});

/** Search-friendly articles managed in the admin dashboard. */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  coverImageUrl: text("coverImageUrl"),
  seoTitle: varchar("seoTitle", { length: 240 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 80 }).notNull().default("general"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Anonymous-or-user discovery test results; signup is never forced. */
export const pathRecommendations = mysqlTable("path_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  sessionKey: varchar("sessionKey", { length: 96 }),
  primaryGoal: varchar("primaryGoal", { length: 100 }).notNull(),
  answersJson: text("answersJson").notNull(),
  recommendedPathSlug: varchar("recommendedPathSlug", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** CTA and WhatsApp intent events without claiming a WhatsApp message was sent. */
export const conversionEvents = mysqlTable("conversion_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 80 }).notNull(),
  source: varchar("source", { length: 120 }).notNull(),
  metaJson: text("metaJson"),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
