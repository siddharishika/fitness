import axios from "axios";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingRecipe from "./RatingRecipe";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function ShowRecipe() {
  let location = useLocation();
  let recipe = location.state;
  let navigate = useNavigate();
  let reviewRef = React.useRef(null);
  const isOwner = recipe.coachId && String(recipe.coachId) === String(recipe.coachId);
  function handleShowRecipe(res) {
    if (
      res.data.success == false &&
      res.data.message == "You need to be authenticated to access this page!"
    ) {
      navigate("/login");
    }
  }
  function handleEditRecipe() {
    navigate(`/recipe/edit`, { state: recipe });
  } 

  const handleDeleteRecipe = async () => {
    try 
    {
      let res = await axios.post(`${API_BASE_URL}/deleterecipe/${recipe._id}`, {}, {
        withCredentials: true,
      });
      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  const handleLikeRecipe = async (e) => {
    try {
      let res = await axios.post(`${API_BASE_URL}/changerecipelike`, recipe, {
        withCredentials: true,
      });

      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
      const reviewText = reviewRef.current ? reviewRef.current.value : "";
      try {
        let res = await axios.post(`${API_BASE_URL}/recipe/addreview/${recipe._id}`, { review: reviewText }, {
        withCredentials: true,
      });
      if (
      res.data.success == false &&
      res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/showrecipe", { state: recipe });
      reviewRef.current.value = "";
      }catch (e) {
        console.log(e, "Nahi ho payega"); 
      }
    }


  return (
    <div>
      <img src={recipe.photo} alt="" />
      <div>{recipe.name}</div>
      <h3>Time Required</h3>
      <div>{recipe.timeRequired + "minutes"} </div>
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
            <li key={i}>{ingr.ingredient + "          " + ingr.amount}</li>
          );
        })}
      </ul>
      <h3>How to cook?</h3>
      <ul>
        {recipe && recipe.process && recipe.process.map((step, i) => {
          return <li key={i}>{step}</li>;
        })}
      </ul>
      {/* <h5>
        Ratings:
        {recipe.rating == 0 && <div>No Ratings Yet</div>}
        {recipe.rating > 0 && <div>{recipe.rating}</div>}
      </h5> */}
      {!isOwner &&
        <> 
        <RatingRecipe recipeId={recipe._id} currentRating={recipe.currentRating} currentRatingCount={recipe.currentRatingCount} isRecipe={true} />
        <br />
        <br />
        <form onSubmit={handleReviewSubmit} method="POST">
          <label htmlFor="review">Review</label>
          <textarea
            name="review"
            id=""
            placeholder="Enter your review here"
            cols="30"
            rows="10"
            ref={reviewRef}
          ></textarea>
          <button type="submit">Submit</button>
        </form>
        </>    
      }
      <button onClick={handleLikeRecipe}>Like this</button>
      {isOwner && (
        <>
          <button onClick={handleEditRecipe}>Edit Recipe</button>
          <button onClick={handleDeleteRecipe}>Delete Recipe</button>
        </>
      )}
      <>
      {recipe && recipe.reviews && recipe.reviews.map((rev, i) => {
        return (
          <div key={i}>
            <h4>{rev.user.username}</h4>
            <p>{rev.review}</p>
          </div>
        );
      })}
      </>
      {/* <button onClick={handleDeleteRecipe}>Delete This</button> */}
    </div>
  );
}

export default ShowRecipe;
