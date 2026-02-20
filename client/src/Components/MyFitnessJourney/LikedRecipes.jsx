import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function LikedVideos() {
  let navigate = useNavigate();
  let [data, setData] = useState();
  useEffect(function () {
    async function getLikedRecipes() {
      let res = await axios.get(`${API_BASE_URL}/getlikedrecipes`, {
        withCredentials: true,
      });

      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      // setVids(res.data.data.LikedVideos);

      // setVideo(res.data.data);
      // setPrograms(res.data.data)
      setData(res.data.data);
    }
    getLikedRecipes();
  }, []);
  const handleRecipeShow = (recipe) => {
    navigate("/showrecipe", { state: recipe });
  };
  console.log(data, "Liked Recipes Data");
  return (
    <div>
      <h1>My Liked Recipes</h1>
      {data &&
        data.likedRecipes &&
        data.likedRecipes.map((recipe, idx) => {
          return (
            <div key={idx} onClick={(e) => handleRecipeShow(recipe)}>
              <h3>{recipe.name}</h3>
              <img src={recipe.photo} alt="" />
              <h5>
                Ratings:
                {recipe.currentRating == 0 && <div>No Ratings Yet</div>}
                {recipe.currentRating > 0 && <div>{recipe.currentRating}</div>}
              </h5>
            </div>
          );
        })}
    </div>
  );
}

export default LikedVideos