import axios from "axios";
import React, { useEffect, useState } from "react";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const itemCardStyle = {
  padding: "10px",
  border: "2px solid #A7C7E7",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: "#000000",
};

const tagGroupBoxStyle = {
  padding: "16px",
  border: "2px solid #A7C7E7",
  borderRadius: "10px",
  backgroundColor: "#161823",
  marginBottom: "28px",
};

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const HORIZONTAL_INSET = 112;

function getCardLimitForWidth(width) {
  const available = width - HORIZONTAL_INSET;
  return Math.max(
    1,
    Math.floor((available + CARD_GAP) / (CARD_WIDTH + CARD_GAP)),
  );
}

const seeMoreLinkStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #A7C7E7",
  backgroundColor: "transparent",
  color: "#A7C7E7",
  cursor: "pointer",
  fontSize: "0.9rem",
};

function orderedTagEntries(tagsObj, predefinedTags = []) {
  const seen = new Set();
  const entries = [];

  predefinedTags.forEach((tag) => {
    if (tagsObj[tag]?.length > 0) {
      entries.push([tag, tagsObj[tag]]);
      seen.add(tag);
    }
  });

  Object.keys(tagsObj)
    .filter((tag) => !seen.has(tag) && tagsObj[tag]?.length > 0)
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag) => {
      entries.push([tag, tagsObj[tag]]);
    });

  return entries;
}

function VideoCard({ video, onClick }) {
  return (
    <Card style={itemCardStyle} onClick={onClick}>
      <Card.Img
        variant="top"
        src={video.imgFileUrl}
        alt={video.name || "Video image"}
        height="300"
        width="400"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />
      <Card.Body>
        <Card.Title style={{ color: "#A7C7E7" }}>
          {video.name} by <i>{video.coach && video.coach.username}</i>
        </Card.Title>
        <Card.Text>
          {video.currentRating > 0 ? (
            <StarRatingDisplay rating={video.currentRating} />
          ) : (
            <span style={{ color: "#A7C7E7" }}>No ratings yet</span>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function TagVideoGroup({ tag, videos, onVideoClick, cardLimit, onSeeMore }) {
  const visibleVideos = videos.slice(0, cardLimit);
  const hasMore = videos.length > cardLimit;

  return (
    <section>
      <h3
        style={{
          color: "#A7C7E7",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        {tag}
      </h3>
      <div style={tagGroupBoxStyle}>
        <CardGroup>
          <div className="cards-container">
            {visibleVideos.map((video, idx) => (
              <VideoCard
                key={video._id || idx}
                video={video}
                onClick={() => onVideoClick(video)}
              />
            ))}
          </div>
        </CardGroup>
        <div style={{ marginTop: "12px" }}>
          {hasMore && (
            <span style={{ color: "#A7C7E7", marginRight: "8px" }}>
              Showing {cardLimit} of {videos.length} videos.
            </span>
          )}
          <button
            type="button"
            style={seeMoreLinkStyle}
            onClick={() => onSeeMore(tag)}
          >
            See more
          </button>
        </div>
      </div>
    </section>
  );
}

function AllVideosTags({ tags: predefinedTags = [] }) {
  let navigate = useNavigate();
  let [tagsVideo, setTagsVideo] = useState({});
  let [loading, setLoading] = useState(true);
  let [cardLimit, setCardLimit] = useState(() =>
    getCardLimitForWidth(window.innerWidth),
  );

  useEffect(() => {
    function updateCardLimit() {
      setCardLimit(getCardLimitForWidth(window.innerWidth));
    }

    updateCardLimit();
    window.addEventListener("resize", updateCardLimit);
    return () => window.removeEventListener("resize", updateCardLimit);
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      const tagList = predefinedTags || [];
      let tagsObj = {};
      for (const tag of tagList) {
        const res = await axios.get(
          `${API_BASE_URL}/allvideos/${encodeURIComponent(tag)}`,
          { withCredentials: true },
        );
        tagsObj[tag] = res.data.data || [];
      }
      setTagsVideo(tagsObj);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  const showVideo = (ele) => {
    navigate("/show", { state: ele });
  };

  const seeAllForTag = (tag) => {
    navigate(`/workoutvideos/tag/${encodeURIComponent(tag)}`);
  };

  const tagEntries = orderedTagEntries(tagsVideo, predefinedTags);
  const hasVideos = tagEntries.length > 0;

  if (loading) {
    return <p style={{ color: "#A7C7E7" }}>Loading videos…</p>;
  }

  if (!hasVideos) {
    return (
      <Card style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823" }}>
        <Card.Body>
          <Card.Title style={{ color: "#A7C7E7" }}>No videos yet</Card.Title>
          <Card.Text style={{ color: "#f4f4f8" }}>
            Videos will appear here grouped by tag once they are added.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#A7C7E7", marginBottom: "20px" }}>
        Workout Videos by Tag
      </h2>
      {tagEntries.map(([tag, videos]) => (
        <TagVideoGroup
          key={tag}
          tag={tag}
          videos={videos}
          onVideoClick={showVideo}
          cardLimit={cardLimit}
          onSeeMore={seeAllForTag}
        />
      ))}
    </div>
  );
}

export default AllVideosTags;
