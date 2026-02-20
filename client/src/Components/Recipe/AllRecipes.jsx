import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // setVideo(res.data.data);
      setRecipes(res.data.data);
    }
    getRecipe();
  }, []);
  const showRecipe = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };
  console.log("These are all recipes", recipes);
  return (
    <div>
      {recipes &&
        recipes.map((recipe, idx) => {
          return (
            <div key={idx} >
              <img
                src={recipe.photo || "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt={recipe.name || 'Recipe image'}
                onClick={(e) => showRecipe(recipe)}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
              <div>{recipe.name}</div>
              <h3>Time Required</h3>
              <div>{recipe.timeRequired + " minutes"} </div>
              <h3>Description</h3>
              <div>{recipe.description}</div>

              <h3>Tags</h3>
              <ul>
                {recipe && recipe.tags && recipe.tags.map((tag, i) => {
                  return <li key={i}>{tag}</li>;
                })}
              </ul>
              <h3>Ingredients</h3>
              <ul>
                {recipe && recipe.ingredients && recipe.ingredients.map((ingr, i) => {
                  return (
                    <li key={i}>
                      {ingr.ingredient + "          " + ingr.amount}
                    </li>
                  );
                })}
              </ul>
              <h3>How to cook?</h3>
              <ul>
                {recipe && recipe.process && recipe.process.map((step, i) => {
                  return <li key={i}>{step}</li>;
                })}
              </ul>
              <h5>
                Ratings: {recipe.currentRatingCount > 0 ? <span>{recipe.currentRating}</span> : <span>No Ratings Yet</span>}
              </h5>
            </div>
          );
        })}
    </div>
  );
}

export default AllRecipes