import React from "react";
import { Card } from "react-bootstrap";

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/32x32?text=User";

function ReviewComment({ review }) {
  const username = review.user?.username || "Unknown User";
  const avatarUrl = review.user?.fileUrl || DEFAULT_PROFILE_IMAGE;

  return (
    <Card style={{ backgroundColor: "#000000", border: "none" }}>
      <Card.Text
        style={{
          color: "#A7C7E7",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <img
          src={avatarUrl}
          alt={`${username} profile`}
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
          }}
        />
        <strong>
          <i>{username}</i>
        </strong>
      </Card.Text>
      <Card.Title
        style={{ color: "#A7C7E7", fontSize: "1rem", fontWeight: "normal" }}
      >
        {review.review}
      </Card.Title>
    </Card>
  );
}

export default ReviewComment;
