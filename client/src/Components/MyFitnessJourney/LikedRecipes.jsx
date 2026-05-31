import axios from "axios";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import { useLoginPrompt } from "../Utils/useLoginPrompt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function LikedRecipes() {
  let navigate = useNavigate();
  let [data, setData] = useState();
  const { handleAuthResponse } = useLoginPrompt();
  useEffect(function () {
    async function getLikedRecipes() {
      let res = await axios.get(`${API_BASE_URL}/getlikedrecipes`, {
        withCredentials: true,
      });

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }

      setData(res.data.data);
    }
    getLikedRecipes();
  }, []);
  const handleRecipeShow = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };
  return (
    <>
      <div>
        <h1>My Liked Recipes</h1>
        <br />
        {data && data.likedRecipes && data.likedRecipes.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {data.likedRecipes.map((recipe, idx) => {
                return (
                  <Card
                    key={idx}
                    style={{
                      padding: "10px",
                      border: "2px solid #A7C7E7",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRecipeShow(recipe)}
                  >
                    {recipe.photo && (
                      <Card.Img
                        variant="top"
                        src={recipe.photo}
                        alt={recipe.name || "Recipe image"}
                        height="300"
                        width="400"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    )}
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
        ) : (
          <div style={{ padding: "20px" }}>
            <Card
              style={{
                border: "2px solid #A7C7E7",
                backgroundColor: "#161823",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "#A7C7E7" }}>
                  No liked recipes yet
                </Card.Title>
                <Card.Text style={{ color: "#f4f4f8" }}>
                  Like recipes to see them here.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default LikedRecipes;
