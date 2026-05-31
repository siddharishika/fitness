export function getUserRatingEntry(ratings, userId) {
  if (!userId || !Array.isArray(ratings)) {
    return null;
  }
  return (
    ratings.find(
      (entry) => String(entry.user?._id ?? entry.user) === String(userId)
    ) ?? null
  );
}

export function hasUserRated(ratings, userId) {
  return getUserRatingEntry(ratings, userId) != null;
}
