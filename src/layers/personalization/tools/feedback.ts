import type { Feedback, UserProfile } from "@/types";

/**
 * In-memory store for feedback and profiles.
 * Will be replaced with persistent storage in later milestones.
 */
const feedbackStore: Map<string, Feedback[]> = new Map();
const profileStore: Map<string, UserProfile> = new Map();

/**
 * recordFeedback(sessionId, feedback) -> { success, error? }
 * Core.md Tool #8
 *
 * Stores feedback for a session. Validates inputs.
 */
export function recordFeedback(
  sessionId: string,
  feedback: Feedback,
): { success: boolean; error?: string } {
  if (!sessionId) {
    return { success: false, error: "sessionId is required" };
  }

  if (feedback.rating < 1 || feedback.rating > 5) {
    return { success: false, error: "rating must be between 1 and 5" };
  }

  const existing = feedbackStore.get(sessionId) ?? [];
  existing.push(feedback);
  feedbackStore.set(sessionId, existing);

  return { success: true };
}

/**
 * getUserProfile(userId) -> UserProfile
 *
 * Returns the user profile for the given ID.
 * Creates a default profile if the user is new.
 */
export function getUserProfile(userId: string): UserProfile {
  const existing = profileStore.get(userId);
  if (existing) return existing;

  const newProfile: UserProfile = {
    id: userId,
    preferences: {},
    readingLevel: "grade4",
    humorLevel: "medium",
    modalityPrefs: ["visual"],
  };

  profileStore.set(userId, newProfile);
  return newProfile;
}

/**
 * Reset store — for testing only.
 */
export function _resetStore(): void {
  feedbackStore.clear();
  profileStore.clear();
}
