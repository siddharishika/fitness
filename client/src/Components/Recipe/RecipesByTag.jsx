import axios from "axios";
import React, { useEffect, useState } from "react";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";

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

const sectionBoxStyle = {
  padding: "16px",
  border: "2px solid #A7C7E7",
  borderRadius: "10px",
  backgroundColor: "#161823",
  marginBottom: "28px",
};

const sectionHeadingStyle = {
  color: "#A7C7E7",
  marginBottom: "12px",
  fontWeight: 600,
};

const backLinkStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #A7C7E7",
  backgroundColor: "transparent",
  color: "#A7C7E7",
  cursor: "pointer",
  fontSize: "0.9rem",
  marginBottom: "16px",
};

function RecipesByTag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/allrecipes/${encodeURIComponent(tag)}`,
          { withCredentials: true },
        );
        setRecipes(res.data.data || []);
      } catch (e) {
        setError("Could not load recipes. Please try again.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      fetchRecipes();
    }
  }, [tag]);

  const showRecipe = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };

  if (loading) {
    return <p style={{ color: "#A7C7E7" }}>Loading recipes…</p>;
  }

  if (error) {
    return <p style={{ color: "#f4f4f8" }}>{error}</p>;
  }

  return (
    <div>
      <button
        type="button"
        style={backLinkStyle}
        onClick={() => navigate("/allrecipes/tags")}
      >
        ← Back to all tags
      </button>

      <div style={sectionBoxStyle}>
        <h2 style={sectionHeadingStyle}>{tag}</h2>
        {recipes.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {recipes.map((recipe, idx) => (
                <Card
                  key={recipe._id || idx}
                  style={recipeCardStyle}
                  onClick={() => showRecipe(recipe)}
                >
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
                      <strong>Time Required:</strong> {recipe.timeRequired}{" "}
                      minutes
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
                          <span style={{ color: "#A7C7E7" }}>
                            No ratings yet
                          </span>
                        )}
                      </h5>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </CardGroup>
        ) : (
          <Card
            style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823" }}
          >
            <Card.Body>
              <Card.Title style={{ color: "#A7C7E7" }}>
                No recipes found
              </Card.Title>
              <Card.Text style={{ color: "#f4f4f8" }}>
                No recipes are tagged with &ldquo;{tag}&rdquo; yet.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}

export default RecipesByTag;
