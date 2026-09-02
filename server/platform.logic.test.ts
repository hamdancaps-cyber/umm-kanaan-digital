/** Unit coverage for the deterministic discovery-path recommendation rule. */
import { describe, expect, it } from "vitest";
import { recommendPathFromGoal } from "./platform.logic";

describe("recommendPathFromGoal", () => {
  it("matches declared goals to their relevant learning paths", () => {
    expect(recommendPathFromGoal("marketing")).toBe("digital-marketing");
    expect(recommendPathFromGoal("ai")).toBe("ai-practical");
  });

  it("uses the digital start path when a goal is uncertain or unknown", () => {
    expect(recommendPathFromGoal("unsure")).toBe("digital-start");
    expect(recommendPathFromGoal("unexpected-input")).toBe("digital-start");
  });
});
