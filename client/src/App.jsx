import React from 'react'
import './App.css'
import { Route , Routes } from 'react-router-dom'
import { IKContext } from 'imagekitio-react';
import Upload from './Components/Video/Upload';
import AllVideos from './Components/Video/AllVideos';
import SignUp from './Components/Video/SignUp';
import Navigation from './Components/Navigation';
import Login from './Components/Auth/Login';
import axios from 'axios'
import Show from './Components/Video/Show';
import EditVideo from './Components/Video/EditVideo';
import UploadDemo from './Components/Video/UploadDemo';
import AddProgram from './Components/Program/AddProgram';
import AllPrograms from './Components/Program/AllPrograms';
import ShowProgram from './Components/Program/ShowProgram';
import EditProgram from './Components/Program/EditProgram';
import AddRecipe from './Components/Recipe/AddRecipe';
import AllRecipes from './Components/Recipe/AllRecipes';
import ShowRecipe from './Components/Recipe/ShowRecipe';
import MyJourney from './Components/MyFitnessJourney/MyJourney';
import LikedVideos from './Components/MyFitnessJourney/LikedVideos';
import MyVideos from './Components/MyFitnessJourney/MyVideos';
import LikedPrograms from './Components/MyFitnessJourney/LikedPrograms';
import LikedRecipes from './Components/MyFitnessJourney/LikedRecipes';
import MyPrograms from './Components/MyFitnessJourney/MyPrograms';
import MyRecipes from './Components/MyFitnessJourney/MyRecipes';
function App() {
  const publicKey = "public_hqcMKg5zm7N3LPo9FksQQRaePeM=";
  const urlEndpoint = "https://ik.imagekit.io/6p3jtqlgt/";
  let id="";
  


 
  // authenticator();
  return (
    <div className="App">
      {/* <p>To use this funtionality please remember to setup the server</p> */}
      <Navigation/>
     
        {/* <IKUpload fileName={name} tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} /> */}
        {/* <Upload /> */}
        <Routes>
        <Route path='/' element={<AllVideos/>}/>
          {/* <Route path='/new' element={<Upload />}/> */}
          <Route path='/new' element={<UploadDemo/>}  />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route  path='/show' element={<Show />}   />
          <Route  path='/edit' element={<EditVideo />}   />
          <Route  path='/addprogram' element={<AddProgram />}   />
          <Route  path='/allprograms' element={<AllPrograms />}   />
          <Route  path='/showprogram' element={<ShowProgram />}   />
          <Route  path='/editprogram' element={<EditProgram />}   />
          <Route  path='/addrecipe' element={<AddRecipe />}   />
          <Route  path='/allrecipes' element={<AllRecipes />}   />
          <Route  path='/showrecipe' element={<ShowRecipe />}   />
          <Route  path='/myjourney' element={<MyJourney />}   />
          <Route  path='/likedvideos' element={<LikedVideos />}   />
          <Route  path='/myvideos' element={<MyVideos />}   />
          <Route  path='/likedprograms' element={<LikedPrograms />}   />
          <Route  path='/likedrecipes' element={<LikedRecipes />}   />
          <Route  path='/myprograms' element={<MyPrograms />}   />
          <Route  path='/myrecipes' element={<MyRecipes />}   />
        </Routes>
        
    </div>
  );

  
  
}

export default App
