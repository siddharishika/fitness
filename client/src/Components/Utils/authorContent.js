export const AUTHOR_CONTENT_MESSAGE =
  "You cannot rate or review your own content.";

export function isAuthorContentError(errorOrResponse) {
  const status = errorOrResponse?.response?.status;
  const data =
    errorOrResponse?.response?.data ?? errorOrResponse?.data ?? errorOrResponse;
  const message = String(data?.message ?? data?.msg ?? "").toLowerCase();
  return (
    status === 403 ||
    (data?.success === false &&
      (message.includes("your own content") ||
        message.includes("author of this video") ||
        message.includes("author of this program") ||
        message.includes("author of this recipe")))
  );
}
