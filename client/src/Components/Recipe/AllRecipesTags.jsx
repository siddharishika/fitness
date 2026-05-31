import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";
import StarRatingDisplay from "../Utils/StarRatingDisplay";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const DEFAULT_RECIPE_IMAGE =
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const recipeCardStyle = {
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

function recipeId(recipe) {
  return recipe._id?.toString?.() ?? recipe._id;
}

function groupRecipesByTag(allRecipes, predefinedTags = []) {
  const grouped = {};

  predefinedTags.forEach((tag) => {
    grouped[tag] = [];
  });

  allRecipes.forEach((recipe) => {
    (recipe.tags || []).forEach((tag) => {
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      if (!grouped[tag].some((r) => recipeId(r) === recipeId(recipe))) {
        grouped[tag].push(recipe);
      }
    });
  });

  return grouped;
}

function orderedTagEntries(grouped, predefinedTags = []) {
  const seen = new Set();
  const entries = [];

  predefinedTags.forEach((tag) => {
    if (grouped[tag]?.length > 0) {
      entries.push([tag, grouped[tag]]);
      seen.add(tag);
    }
  });

  Object.keys(grouped)
    .filter((tag) => !seen.has(tag) && grouped[tag]?.length > 0)
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag) => {
      entries.push([tag, grouped[tag]]);
    });

  return entries;
}

function RecipeCard({ recipe, onClick }) {
  return (
    <Card style={recipeCardStyle} onClick={onClick}>
      <Card.Img
        variant="top"
        src={recipe.photo || DEFAULT_RECIPE_IMAGE}
        alt={recipe.name || "Recipe image"}
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
          {recipe.name}
          {recipe.user?.username && (
            <>
              {" "}
              by <i>{recipe.user.username}</i>
            </>
          )}
        </Card.Title>
        <div style={{ color: "#f4f4f8" }}>
          <strong>Time Required:</strong> {recipe.timeRequired} minutes
          <br />
          <strong>Description:</strong> {recipe.description}
          <h5
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            Ratings:
            {recipe.currentRating > 0 ? (
              <StarRatingDisplay rating={recipe.currentRating} />
            ) : (
              <span style={{ color: "#A7C7E7" }}>No ratings yet</span>
            )}
          </h5>
        </div>
      </Card.Body>
    </Card>
  );
}

function TagRecipeGroup({ tag, recipes, onRecipeClick, cardLimit, onSeeMore }) {
  const visibleRecipes = recipes.slice(0, cardLimit);
  const hasMore = recipes.length > cardLimit;

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
            {visibleRecipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe._id || idx}
                recipe={recipe}
                onClick={() => onRecipeClick(recipe)}
              />
            ))}
          </div>
        </CardGroup>
        <div style={{ marginTop: "12px" }}>
          {hasMore && (
            <span style={{ color: "#A7C7E7", marginRight: "8px" }}>
              Showing {cardLimit} of {recipes.length} recipes.
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

function AllRecipesTags({ tags: predefinedTags = [] }) {
  let navigate = useNavigate();
  let [tagsRecipe, setTagsRecipe] = useState({});
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
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
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/allrecipes`, {
          withCredentials: true,
        });
        const allRecipes = res.data.data || [];
        setTagsRecipe(groupRecipesByTag(allRecipes, predefinedTags));
      } catch (e) {
        setError("Could not load recipes. Please try again.");
        setTagsRecipe({});
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const showRecipe = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };

  const seeAllForTag = (tag) => {
    navigate(`/allrecipes/tag/${encodeURIComponent(tag)}`);
  };

  const tagEntries = orderedTagEntries(tagsRecipe, predefinedTags);
  const hasRecipes = tagEntries.length > 0;

  if (loading) {
    return <p style={{ color: "#A7C7E7" }}>Loading recipes…</p>;
  }

  if (error) {
    return <p style={{ color: "#f4f4f8" }}>{error}</p>;
  }

  if (!hasRecipes) {
    return (
      <Card style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823" }}>
        <Card.Body>
          <Card.Title style={{ color: "#A7C7E7" }}>No recipes yet</Card.Title>
          <Card.Text style={{ color: "#f4f4f8" }}>
            Recipes will appear here grouped by tag once they are added.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#A7C7E7", marginBottom: "20px" }}>Recipes by Tag</h2>
      {tagEntries.map(([tag, recipes]) => (
        <TagRecipeGroup
          key={tag}
          tag={tag}
          recipes={recipes}
          onRecipeClick={showRecipe}
          cardLimit={cardLimit}
          onSeeMore={seeAllForTag}
        />
      ))}
    </div>
  );
}

export default AllRecipesTags;
