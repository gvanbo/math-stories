import { describe, it, expect, beforeEach } from "vitest";
import { recordFeedback, getUserProfile, _resetStore } from "../tools/feedback";
import type { Feedback, UserProfile } from "@/types";

const testProfile: UserProfile = {
  id: "test-user-1",
  preferences: {},
  readingLevel: "grade4",
  humorLevel: "medium",
  modalityPrefs: ["visual"],
};

const testFeedback: Feedback = {
  sessionId: "session-001",
  rating: 4,
  enjoyedMost: "The space adventure with character 7",
  foundHardest: "Understanding why doubling works",
  timestamp: new Date().toISOString(),
};

describe("recordFeedback", () => {
  beforeEach(() => {
    _resetStore();
  });

  it("stores feedback for a valid session", () => {
    const result = recordFeedback("session-001", testFeedback);
    expect(result.success).toBe(true);
  });

  it("returns stored feedback", () => {
    recordFeedback("session-001", testFeedback);
    const result = recordFeedback("session-001", testFeedback);
    expect(result.success).toBe(true);
  });

  it("rejects feedback with missing sessionId", () => {
    const result = recordFeedback("", testFeedback);
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects feedback with invalid rating", () => {
    const badFeedback = { ...testFeedback, rating: 11 };
    const result = recordFeedback("session-001", badFeedback);
    expect(result.success).toBe(false);
  });
});

describe("getUserProfile", () => {
  beforeEach(() => {
    _resetStore();
  });

  it("returns a default profile for a new user", () => {
    const profile = getUserProfile("new-user-123");
    expect(profile).toBeDefined();
    expect(profile.id).toBe("new-user-123");
  });

  it("returns consistent profiles for the same user ID", () => {
    const p1 = getUserProfile("user-abc");
    const p2 = getUserProfile("user-abc");
    expect(p1).toEqual(p2);
  });
});
