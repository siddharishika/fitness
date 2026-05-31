import React, { useId } from "react";

const FILLED_COLOR = "rgb(255, 212, 59)";
const EMPTY_COLOR = "#4a4f5c";
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function SingleStar({ fill }) {
  const clipId = useId();
  const clampedFill = Math.max(0, Math.min(1, fill));
  const clipWidth = 24 * clampedFill;

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d={STAR_PATH} fill={EMPTY_COLOR} />
      {clampedFill > 0 && (
        <>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={clipWidth} height="24" />
          </clipPath>
          <path
            d={STAR_PATH}
            fill={FILLED_COLOR}
            clipPath={`url(#${clipId})`}
          />
        </>
      )}
    </svg>
  );
}

export default function StarRatingDisplay({
  rating = 0,
  maxStars = 5,
  fontSize = "clamp(12px, 1.6vw, 20px)",
  style,
  className,
}) {
  if (!rating || rating <= 0) {
    return null;
  }

  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    const fill = Math.min(1, Math.max(0, rating - i));
    stars.push(<SingleStar key={i} fill={fill} />);
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        gap: "0.25em",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize,
        lineHeight: 0,
        ...style,
      }}
    >
      {stars}
    </span>
  );
}
