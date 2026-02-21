import { describe, it, expect } from "vitest";
import { planLesson } from "../tools/planLesson";
import type { UserProfile } from "@/types";

const mockProfile: UserProfile = {
  id: "test-user-1",
  preferences: {},
  readingLevel: "grade4",
  humorLevel: "medium",
  modalityPrefs: ["visual", "kinesthetic"],
};

describe("planLesson", () => {
  it("returns a LessonPlan for a valid concept ID", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(lesson).toBeDefined();
    expect(lesson!.conceptId).toBe("mult-equal-groups");
  });

  it("returns null for an invalid concept ID", () => {
    const lesson = planLesson("nonexistent", mockProfile);
    expect(lesson).toBeNull();
  });

  it("lesson references the user ID", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(lesson!.userId).toBe("test-user-1");
  });

  it("lesson selects a valid CPA stage", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(["concrete", "pictorial", "symbolic"]).toContain(lesson!.selectedStage);
  });

  it("lesson selects a differentiation level", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(["struggling", "onLevel", "advanced"]).toContain(lesson!.selectedLevel);
  });

  it("lesson has activities", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(lesson!.activities.length).toBeGreaterThan(0);
  });

  it("lesson has checks-for-understanding", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(lesson!.checksForUnderstanding.length).toBeGreaterThan(0);
  });

  it("lesson has host notes", () => {
    const lesson = planLesson("mult-equal-groups", mockProfile);
    expect(lesson!.hostNotes).toBeTruthy();
  });
});
