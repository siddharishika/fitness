import axios from 'axios';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup, Button } from 'react-bootstrap';
import '../../App.css';
import StarRatingDisplay from '../Utils/StarRatingDisplay';
import { useLoginPrompt } from '../Utils/useLoginPrompt';
import { useAuth } from '../Utils/AuthProvider';
import isCoach from '../Utils/isCoach';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function MyRecipes() {
  let navigate = useNavigate();
  let [data, setData] = useState([]);
  const { handleAuthResponse } = useLoginPrompt();
  const { user } = useAuth();
  const userIsCoach = isCoach(user);
  useEffect(function () {
    async function getMyRecipes() {
      let res = await axios.get(`${API_BASE_URL}/getmyrecipes`, {
        withCredentials: true,
      });

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      setData(res.data.data);
    }
    getMyRecipes();
  }, []);

  const handleShowRecipe = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };
  const handleAddRecipe = () => {
    navigate("/recipe/add");
  };

  return (
    <>
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ margin: 0 }}>My Recipes</h1>
        {userIsCoach && (
          <Button variant="light" style={submitBtnStyle} onClick={handleAddRecipe}>
            Add Recipe
          </Button>
        )}
      </div>
      <br />
      {data && data.length > 0 ? (
        <CardGroup>
          <div className="cards-container">
            {data.map((recipe, idx) => {
              return (
                <Card
                  key={idx}
                  style={{ padding: '10px', border: "2px solid #A7C7E7", borderRadius: "10px", cursor: "pointer" }}
                  onClick={() => handleShowRecipe(recipe)}
                >
                  {recipe.photo && (
                    <Card.Img
                      variant="top"
                      src={recipe.photo}
                      alt={recipe.name || 'Recipe image'}
                      height="300"
                      width="400"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    <div style={{ color: '#f4f4f8' }}>
                      <strong>Time Required:</strong> {recipe.timeRequired + " minutes"}
                      <br />
                      <strong>Description: {recipe.description} </strong>
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        Ratings:
                        {recipe.currentRating > 0 ? (
                          <StarRatingDisplay rating={recipe.currentRating} />
                        ) : (
                          <span style={{ color: '#A7C7E7' }}>No Ratings Yet</span>
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
        <div style={{ padding: '20px' }}>
          <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
            <Card.Body>
              <Card.Title style={{ color: '#A7C7E7' }}>No recipes yet</Card.Title>
              <Card.Text style={{ color: '#f4f4f8' }}>Add recipes to see them here.</Card.Text>
              {userIsCoach && (
                <Button variant="light" style={submitBtnStyle} onClick={handleAddRecipe}>
                  Add Recipe
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
    </>
  );
}

export default MyRecipes
