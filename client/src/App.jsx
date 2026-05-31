import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import Upload from "./Components/Video/Upload";
import AllVideos from "./Components/Video/AllVideos";
import AllVideosTags from "./Components/Video/AllVideosTags";
import VideosByTag from "./Components/Video/VideosByTag";
import SignUp from "./Components/Video/SignUp";
import Navigation from "./Components/Navigation";
import Login from "./Components/Auth/Login";
import EditUser from "./Components/Auth/EditUser";
import axios from "axios";
import Show from "./Components/Video/Show";
import EditVideo from "./Components/Video/EditVideo";
import UploadDemo from "./Components/Video/UploadDemo";
import AddProgram from "./Components/Program/AddProgram";
import AllPrograms from "./Components/Program/AllPrograms";
import ShowProgram from "./Components/Program/ShowProgram";
import EditProgram from "./Components/Program/EditProgram";
import AddRecipe from "./Components/Recipe/AddRecipe";
import EditRecipe from "./Components/Recipe/EditRecipe";
import AllRecipes from "./Components/Recipe/AllRecipes";
import AllRecipesTags from "./Components/Recipe/AllRecipesTags";
import RecipesByTag from "./Components/Recipe/RecipesByTag";
import ShowRecipe from "./Components/Recipe/ShowRecipe";
import MyJourney from "./Components/MyFitnessJourney/MyJourney";
import LikedVideos from "./Components/MyFitnessJourney/LikedVideos";
import MyVideos from "./Components/MyFitnessJourney/MyVideos";
import LikedPrograms from "./Components/MyFitnessJourney/LikedPrograms";
import LikedRecipes from "./Components/MyFitnessJourney/LikedRecipes";
import MyPrograms from "./Components/MyFitnessJourney/MyPrograms";
import MyRecipes from "./Components/MyFitnessJourney/MyRecipes";
import Home from "./Components/Home/Home";
import AllProgramsTags from "./Components/Program/AllProgramsTags";
import ProgramsByTag from "./Components/Program/ProgramsByTag";
import RequireAuth from "./Components/Utils/RequireAuth";
import RequireCoach from "./Components/Utils/RequireCoach";
import NotFound from "./Components/Utils/NotFound";
import { RECIPE_TAGS } from "./Components/Utils/recipeTags";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
function App() {
  const publicKey = import.meta.env.publicKey; ;
  const urlEndpoint = import.meta.env.urlEndpoint; ;
  let id = "";
  const workoutTags = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Wight Loss",
    "Abs",
    "Strength Training",
    "Cardio",
    "Yoga",
    "Pilates",
    "Flexibility",
    "Booty",
    "Legs",
    "Ärms",
    "Upper Body",
    "Lower Body",
    "Full Body",
    "HIIT",
    "Dance",
    "Boxing",
    "Martial Arts",
    "Stretching",
    "No Equipment",
  ];

  // authenticator();
  return (
    <>
      <div style={{
        backgroundColor: "#0e0f14",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1
      }} />
      <div className="App" style={{ position: "relative", zIndex: 1 }}>
        {/* <p>To use this funtionality please remember to setup the server</p> */}

        {/* <IKUpload fileName={name} tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} /> */}
        {/* <Upload /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workoutvideos" element={<AllVideos />} />
          {/* <Route path='/new' element={<Upload />}/> */}
          <Route
            path="/workoutvideos/tags"
            element={<AllVideosTags tags={workoutTags} />}
          />
          <Route path="/workoutvideos/tag/:tag" element={<VideosByTag />} />
          <Route path="video/add" element={<RequireAuth redirectToLogin><RequireCoach><UploadDemo tags={workoutTags} /></RequireCoach></RequireAuth>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/show" element={<Show />} />
          <Route path="video/edit" element={<RequireAuth redirectToLogin><RequireCoach><EditVideo tags={workoutTags}/></RequireCoach></RequireAuth>} />
          <Route path="program/add" element={<RequireAuth redirectToLogin><RequireCoach><AddProgram tags={workoutTags} /></RequireCoach></RequireAuth>} />
          <Route path="/allprograms" element={<AllPrograms />} />
          <Route path="/allprograms/tags" element={<AllProgramsTags tags={workoutTags} />} />
          <Route path="/allprograms/tag/:tag" element={<ProgramsByTag />} />
          <Route path="/showprogram" element={<ShowProgram />} />
          <Route path="program/edit" element={<RequireAuth redirectToLogin><RequireCoach><EditProgram tags={workoutTags} /></RequireCoach></RequireAuth>} />
          <Route path="/recipe/add" element={<RequireAuth redirectToLogin><RequireCoach><AddRecipe tags={RECIPE_TAGS} /></RequireCoach></RequireAuth>} />
          <Route path="/allrecipes" element={<AllRecipes />} />
          <Route
            path="/allrecipes/tags"
            element={<AllRecipesTags tags={RECIPE_TAGS} />}
          />
          <Route path="/allrecipes/tag/:tag" element={<RecipesByTag />} />
          <Route path="/showrecipe" element={<ShowRecipe />} />
          <Route path="/myjourney" element={<RequireAuth redirectToLogin><MyJourney /></RequireAuth>} />
          <Route path="/edituser" element={<RequireAuth redirectToLogin><EditUser /></RequireAuth>} />
          <Route path="/likedvideos" element={<RequireAuth redirectToLogin><LikedVideos /></RequireAuth>} />
          <Route path="/myvideos" element={<RequireAuth redirectToLogin><RequireCoach><MyVideos /></RequireCoach></RequireAuth>} />
          <Route path="/likedprograms" element={<RequireAuth redirectToLogin><LikedPrograms /></RequireAuth>} />
          <Route path="/likedrecipes" element={<RequireAuth redirectToLogin><LikedRecipes /></RequireAuth>} />
          <Route path="/myprograms" element={<RequireAuth redirectToLogin><RequireCoach><MyPrograms /></RequireCoach></RequireAuth>} />
          <Route path="/myrecipes" element={<RequireAuth redirectToLogin><RequireCoach><MyRecipes /></RequireCoach></RequireAuth>} />
          <Route path="/recipe/edit" element={<RequireAuth redirectToLogin><RequireCoach><EditRecipe tags={RECIPE_TAGS} /></RequireCoach></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
