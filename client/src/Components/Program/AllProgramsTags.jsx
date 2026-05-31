import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import { getProgramImage } from "../Utils/getProgramImage";

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

function ProgramCard({ program, onClick }) {
  return (
    <Card style={itemCardStyle} onClick={onClick}>
      <Card.Img
        variant="top"
        src={getProgramImage(program)}
        alt={program.name || "Program image"}
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
          {program.name} by <i>{program.coach && program.coach.username}</i>
        </Card.Title>
        <Card.Text>
          {program.currentRating > 0 ? (
            <StarRatingDisplay rating={program.currentRating} />
          ) : (
            <span style={{ color: "#A7C7E7" }}>No ratings yet</span>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function TagProgramGroup({
  tag,
  programs,
  onProgramClick,
  cardLimit,
  onSeeMore,
}) {
  const visiblePrograms = programs.slice(0, cardLimit);
  const hasMore = programs.length > cardLimit;

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
            {visiblePrograms.map((program, idx) => (
              <ProgramCard
                key={program._id || idx}
                program={program}
                onClick={() => onProgramClick(program)}
              />
            ))}
          </div>
        </CardGroup>
        <div style={{ marginTop: "12px" }}>
          {hasMore && (
            <span style={{ color: "#A7C7E7", marginRight: "8px" }}>
              Showing {cardLimit} of {programs.length} programs.
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

function AllProgramsTags({ tags: predefinedTags = [] }) {
  let navigate = useNavigate();
  let [tagsProgram, setTagsProgram] = useState({});
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
    async function fetchPrograms() {
      setLoading(true);
      const tagList = predefinedTags || [];
      let tagsObj = {};
      for (const tag of tagList) {
        const res = await axios.get(
          `${API_BASE_URL}/allprograms/${encodeURIComponent(tag)}`,
          { withCredentials: true },
        );
        tagsObj[tag] = res.data.data || [];
      }
      setTagsProgram(tagsObj);
      setLoading(false);
    }
    fetchPrograms();
  }, []);

  const showProgram = (program) => {
    navigate("/showprogram", { state: program });
  };

  const seeAllForTag = (tag) => {
    navigate(`/allprograms/tag/${encodeURIComponent(tag)}`);
  };

  const tagEntries = orderedTagEntries(tagsProgram, predefinedTags);
  const hasPrograms = tagEntries.length > 0;

  if (loading) {
    return <p style={{ color: "#A7C7E7" }}>Loading programs…</p>;
  }

  if (!hasPrograms) {
    return (
      <Card style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823" }}>
        <Card.Body>
          <Card.Title style={{ color: "#A7C7E7" }}>No programs yet</Card.Title>
          <Card.Text style={{ color: "#f4f4f8" }}>
            Programs will appear here grouped by tag once they are added.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#A7C7E7", marginBottom: "20px" }}>
        Workout Programs by Tag
      </h2>
      {tagEntries.map(([tag, programs]) => (
        <TagProgramGroup
          key={tag}
          tag={tag}
          programs={programs}
          onProgramClick={showProgram}
          cardLimit={cardLimit}
          onSeeMore={seeAllForTag}
        />
      ))}
    </div>
  );
}

export default AllProgramsTags;
