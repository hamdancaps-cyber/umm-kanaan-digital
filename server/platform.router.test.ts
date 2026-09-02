import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getPublishedContentBlock: vi.fn(),
  listAllFaqs: vi.fn(),
  listContentBlocks: vi.fn(),
  listPublishedArticles: vi.fn(),
  listPublishedCourses: vi.fn(),
  listPublishedFaqs: vi.fn(),
  listPublishedLeadMagnets: vi.fn(),
  listPublishedLearningPaths: vi.fn(),
  listSettings: vi.fn(),
  listUserEnrollments: vi.fn(),
  enrollUserInCourse: vi.fn(),
  completeLessonForUser: vi.fn(),
  getPublishedCourseBySlug: vi.fn(),
  recordConversionEvent: vi.fn(),
  saveFaq: vi.fn(),
  savePathRecommendation: vi.fn(),
  upsertContentBlock: vi.fn(),
  upsertSiteSetting: vi.fn(),
  submitQuizAttempt: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { platformRouter } from "./routers/platform";

function createContext(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "sample-user",
      email: "sample@example.com",
      name: "Sample User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("platform router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.getPublishedContentBlock.mockResolvedValue({ blockKey: "trainer_bio", title: "نبذة", body: "محتوى", published: true });
    dbMocks.recordConversionEvent.mockResolvedValue({ saved: true });
    dbMocks.enrollUserInCourse.mockResolvedValue({ saved: true, alreadyEnrolled: false });
    dbMocks.completeLessonForUser.mockResolvedValue({ saved: true, progressPercent: 33 });
    dbMocks.submitQuizAttempt.mockResolvedValue({ saved: true, score: 100, passed: true });
    dbMocks.upsertSiteSetting.mockResolvedValue({ saved: true });
  });

  it("returns an editable published content block to public pages", async () => {
    const caller = platformRouter.createCaller(createContext());
    const result = await caller.public.contentBlock({ blockKey: "trainer_bio" });

    expect(result?.title).toBe("نبذة");
    expect(dbMocks.getPublishedContentBlock).toHaveBeenCalledWith("trainer_bio");
  });

  it("records a typed page view event", async () => {
    const caller = platformRouter.createCaller(createContext());
    const result = await caller.analytics.track({ eventType: "page_view", source: "/academy" });

    expect(result).toEqual({ saved: true });
    expect(dbMocks.recordConversionEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: "page_view", source: "/academy", userId: 1 }));
  });

  it("blocks user accounts from administrator-only settings", async () => {
    const caller = platformRouter.createCaller(createContext("user"));
    await expect(caller.admin.settings()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("enrolls an authenticated learner and records lesson completion", async () => {
    const caller = platformRouter.createCaller(createContext());
    await expect(caller.account.enrollCourse({ courseId: 8 })).resolves.toEqual({ saved: true, alreadyEnrolled: false });
    await expect(caller.account.completeLesson({ lessonId: 12 })).resolves.toEqual({ saved: true, progressPercent: 33 });
    expect(dbMocks.enrollUserInCourse).toHaveBeenCalledWith(1, 8);
    expect(dbMocks.completeLessonForUser).toHaveBeenCalledWith(1, 12);
  });

  it("records a submitted quiz attempt for an authenticated learner", async () => {
    const caller = platformRouter.createCaller(createContext());
    const result = await caller.account.submitQuiz({ quizId: 3, answers: [{ questionId: 5, option: 0 }] });
    expect(result).toEqual({ saved: true, score: 100, passed: true });
    expect(dbMocks.submitQuizAttempt).toHaveBeenCalledWith(1, 3, [{ questionId: 5, option: 0 }]);
  });

  it("lets an administrator save an editable setting", async () => {
    const caller = platformRouter.createCaller(createContext("admin"));
    await expect(caller.admin.saveSetting({ settingKey: "site_title", settingGroup: "seo", value: "منصة أم كنعان الرقمية" })).resolves.toEqual({ saved: true });
    expect(dbMocks.upsertSiteSetting).toHaveBeenCalledWith({ settingKey: "site_title", settingGroup: "seo", value: "منصة أم كنعان الرقمية" });
  });
});
