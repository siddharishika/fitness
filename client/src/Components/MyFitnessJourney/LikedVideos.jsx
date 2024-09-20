import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function LikedVideos() {
    let [data, setData]=useState([]);
    let navigate=useNavigate();
    useEffect(function (){
        async function getLikedVideos(){
            let res = await axios.get("http://localhost:8080/getlikedvideos" ,{withCredentials: true});
            
                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
        
                    navigate('/login');
                    return;
        
                }
                // setVids(res.data.data.LikedVideos);
            
            // setVideo(res.data.data);
            // setPrograms(res.data.data)
            setData(res.data.data)
        }
        getLikedVideos();
    } , [])
    const handleShow=(vid)=>{
        navigate('/show', {state:vid})
    }
  return (
    <div>
        <h1>My Liked Videos</h1>
        {data.likedVideos && 
            data.likedVideos.map((vid,idx)=>{
                return(
                    <div key={idx} onClick={(e)=>handleShow(vid)}>
                        <img src={vid.imgFileUrl} alt="" height="300" width="400"/>
                        <div>{vid.name}</div>
                        <div>{vid.tags.join(" , ")}</div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default LikedVideos