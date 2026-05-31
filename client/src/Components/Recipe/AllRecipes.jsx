import axios from "axios";

import React, { useEffect, useState } from "react";
import { Card, CardGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import StarRatingDisplay from "../Utils/StarRatingDisplay";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function AllRecipes() {
  let [recipes, setRecipes] = useState([]);
  let navigate = useNavigate();
  useEffect(function () {
    async function getRecipe() {
      let res = await axios.get(`${API_BASE_URL}/allrecipes`, {
        withCredentials: true,
      });
      setRecipes(res.data.data);
    }
    getRecipe();
  }, []);
  const showRecipe = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };
  return (
    <div>
      <h2>All Recipes</h2>
      <br />
      <CardGroup>
        <div className="cards-container">
          {recipes &&
            recipes.map((recipe, idx) => {
              return (
                <Card
                  key={idx}
                  style={{
                    padding: "10px",
                    border: "2px solid #A7C7E7",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => showRecipe(recipe)}
                >
                  <Card.Img
                    variant="top"
                    src={
                      recipe.photo ||
                      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
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
                    <Card.Title>{recipe.name}</Card.Title>
                    <div style={{ color: "#f4f4f8" }}>
                      <strong>Time Required:</strong>{" "}
                      {recipe.timeRequired + " minutes"}
                      <br />
                      <strong>Description: {recipe.description} </strong>
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
                            No Ratings Yet
                          </span>
                        )}
                      </h5>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
        </div>
      </CardGroup>
    </div>
  );
}

export default AllRecipes;
