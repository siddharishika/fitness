import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MyJourney() {
    let [user, SetUser]=useState({});
    let navigate=useNavigate();
    useEffect(function (){
        async function getUser(){
            let res = await axios.get("http://localhost:8080/getuser" ,{withCredentials: true});
            function fn(res){
                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                   
        
                    navigate('/login');
        
                }
            }
            fn(res);
            // setVideo(res.data.data);
            // setPrograms(res.data.data)
            SetUser(res.data.data)
        }
        getUser();
    } , [])
    const handleUserLikedVideos=(e)=>{
        navigate('/likedvideos',{state: user});
    }
    const handleUserLikedPrograms=(e)=>{
        navigate('/likedprograms');
    }
    
  return (
    <div>
        <h1>My Journey</h1>
        <h3>My Liked Videos</h3>
        <button onClick={handleUserLikedVideos}>Liked Videos</button>
        <button onClick={handleUserLikedPrograms} >Liked Programs</button>
        <button>Liked Programs</button>
        <button>Liked Recipes</button>
        {user && user.likedVideos && 
            user.likedRecipes.map((vid,idx)=>{
                return(
                    <div>
                        <div>{vid._id}</div>
                        {/* <img src={vid.imgFileUrl} alt="" height="300" width="400"/> */}
                    </div>
                )
            })
        }

    </div>
  )
}

export default MyJourney