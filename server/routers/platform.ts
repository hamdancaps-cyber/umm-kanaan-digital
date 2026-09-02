/** Platform router for public discovery, editable content, and conversion events. */
import { z } from "zod";
import {
  listContentBlocks,
  listAllFaqs,
  listPublishedCourses,
  listPublishedArticles,
  listPublishedFaqs,
  listPublishedLeadMagnets,
  listPublishedLearningPaths,
  listSettings,
  listUserEnrollments,
  listUserFavorites,
  listUserPurchases,
  enrollUserInCourse,
  getPublishedContentBlock,
  getPublishedCourseBySlug,
  completeLessonForUser,
  recordConversionEvent,
  recordConfirmedPurchase,
  savePathRecommendation,
  saveFaq,
  submitQuizAttempt,
  saveUserFavorite,
  upsertContentBlock,
  upsertSiteSetting,
} from "../db";
import { recommendPathFromGoal } from "../platform.logic";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

const publicGoalSchema = z.enum([
  "work-from-phone",
  "marketing",
  "products",
  "content",
  "ai",
  "freelance",
  "personal",
  "unsure",
]);

export const platformRouter = router({
  public: router({
    paths: publicProcedure.query(() => listPublishedLearningPaths()),
    courses: publicProcedure.query(() => listPublishedCourses()),
    courseBySlug: publicProcedure.input(z.object({ slug: z.string().min(2).max(100) })).query(({ input }) => getPublishedCourseBySlug(input.slug)),
    articles: publicProcedure.query(() => listPublishedArticles()),
    faqs: publicProcedure.query(() => listPublishedFaqs()),
    leadMagnets: publicProcedure.query(() => listPublishedLeadMagnets()),
    contentBlock: publicProcedure.input(z.object({ blockKey: z.string().min(2).max(120) })).query(({ input }) => getPublishedContentBlock(input.blockKey)),
  }),
  discovery: router({
    recommend: publicProcedure
      .input(
        z.object({
          goal: publicGoalSchema,
          answers: z.record(z.string(), z.string()).default({}),
          sessionKey: z.string().min(8).max(96).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const recommendedPathSlug = recommendPathFromGoal(input.goal);
        const persistence = await savePathRecommendation({
          userId: ctx.user?.id ?? null,
          sessionKey: input.sessionKey,
          primaryGoal: input.goal,
          answersJson: JSON.stringify(input.answers),
          recommendedPathSlug,
        });
        return { recommendedPathSlug, saved: persistence.saved };
      }),
  }),
  analytics: router({
    track: publicProcedure
      .input(
        z.object({
          eventType: z.string().min(2).max(80),
          source: z.string().min(2).max(120),
          metaJson: z.string().max(3000).optional(),
        })
      )
      .mutation(({ input, ctx }) => recordConversionEvent({ ...input, userId: ctx.user?.id ?? null })),
  }),
  account: router({
    enrollments: protectedProcedure.query(({ ctx }) => listUserEnrollments(ctx.user.id)),
    favorites: protectedProcedure.query(({ ctx }) => listUserFavorites(ctx.user.id)),
    purchases: protectedProcedure.query(({ ctx }) => listUserPurchases(ctx.user.id)),
    enrollCourse: protectedProcedure
      .input(z.object({ courseId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => enrollUserInCourse(ctx.user.id, input.courseId)),
    completeLesson: protectedProcedure.input(z.object({ lessonId: z.number().int().positive() })).mutation(({ ctx, input }) => completeLessonForUser(ctx.user.id, input.lessonId)),
    submitQuiz: protectedProcedure.input(z.object({ quizId: z.number().int().positive(), answers: z.array(z.object({ questionId: z.number().int().positive(), option: z.number().int().min(0).max(20) })) })).mutation(({ ctx, input }) => submitQuizAttempt(ctx.user.id, input.quizId, input.answers)),
    saveFavorite: protectedProcedure.input(z.object({ entityType: z.enum(["path", "course", "product", "article", "resource"]), entityKey: z.string().min(2).max(160) })).mutation(({ ctx, input }) => saveUserFavorite(ctx.user.id, input.entityType, input.entityKey)),
  }),
  admin: router({
    settings: adminProcedure.query(() => listSettings()),
    saveSetting: adminProcedure
      .input(
        z.object({
          settingKey: z.string().min(2).max(120),
          settingGroup: z.string().min(2).max(60),
          value: z.string().min(1).max(10000),
        })
      )
      .mutation(({ input }) => upsertSiteSetting(input)),
    contentBlocks: adminProcedure.query(() => listContentBlocks()),
    saveContentBlock: adminProcedure
      .input(
        z.object({
          blockKey: z.string().min(2).max(120),
          title: z.string().min(2).max(255),
          body: z.string().min(2).max(50000),
          metaJson: z.string().max(15000).nullable().optional(),
          published: z.boolean(),
        })
      )
      .mutation(({ input }) => upsertContentBlock(input)),
    faqs: adminProcedure.query(() => listAllFaqs()),
    saveFaq: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        category: z.string().min(2).max(80),
        question: z.string().min(5).max(5000),
        answer: z.string().min(5).max(15000),
        published: z.boolean(),
        sortOrder: z.number().int().min(0).max(999),
      }))
      .mutation(({ input }) => saveFaq(input)),
    recordPurchase: adminProcedure.input(z.object({
      userId: z.number().int().positive(),
      providerOrderId: z.string().min(3).max(180),
      productTitle: z.string().min(2).max(255),
      productHandle: z.string().min(2).max(180),
      amount: z.string().min(1).max(32),
      currencyCode: z.string().min(3).max(12),
    })).mutation(({ input }) => recordConfirmedPurchase(input)),
  }),
});
