import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import Upload from "./Components/Video/Upload";
import AllVideos from "./Components/Video/AllVideos";
import AllVideosTags from "./Components/Video/AllVideosTags";
import SignUp from "./Components/Video/SignUp";
import Navigation from "./Components/Navigation";
import Login from "./Components/Auth/Login";
import axios from "axios";
import Show from "./Components/Video/Show";
import EditVideo from "./Components/Video/EditVideo";
import UploadDemo from "./Components/Video/UploadDemo";
import AddProgram from "./Components/Program/AddProgram";
import AllPrograms from "./Components/Program/AllPrograms";
import ShowProgram from "./Components/Program/ShowProgram";
import EditProgram from "./Components/Program/EditProgram";
import AddRecipe from "./Components/Recipe/AddRecipe";
import AllRecipes from "./Components/Recipe/AllRecipes";
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
import RequireAuth from "./Components/Utils/RequireAuth";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
function App() {
  const publicKey = import.meta.env.publicKey; ;
  const urlEndpoint = import.meta.env.urlEndpoint; ;
  let id = "";
  const tags = [
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
    <div className="App">
      {/* <p>To use this funtionality please remember to setup the server</p> */}

      {/* <IKUpload fileName={name} tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} /> */}
      {/* <Upload /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workoutvideos" element={<AllVideos />} />
        {/* <Route path='/new' element={<Upload />}/> */}
        <Route
          path="/workoutvideos/tags"
          element={<AllVideosTags tags={tags} />}
        />
        <Route path="/new" element={<UploadDemo tags={tags} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/show" element={<Show />} />
        <Route path="/edit" element={<EditVideo />} />
        <Route path="/addprogram" element={<AddProgram tags={tags} />} />
        <Route path="/allprograms" element={<AllPrograms />} />
        <Route path="/allprograms/tags" element={<AllProgramsTags tags={tags} />} />
        <Route path="/showprogram" element={<ShowProgram />} />
        <Route path="/program/edit" element={<RequireAuth><EditProgram /></RequireAuth>} />
        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route path="/allrecipes" element={<AllRecipes />} />
        <Route path="/showrecipe" element={<ShowRecipe />} />
        <Route path="/myjourney" element={<MyJourney />} />
        <Route path="/likedvideos" element={<LikedVideos />} />
        <Route path="/myvideos" element={<MyVideos />} />
        <Route path="/likedprograms" element={<LikedPrograms />} />
        <Route path="/likedrecipes" element={<LikedRecipes />} />
        <Route path="/myprograms" element={<MyPrograms />} />
        <Route path="/myrecipes" element={<MyRecipes />} />
        <Route path='/recipe/edit' element={<RequireAuth><AddRecipe isEdit={true} /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
