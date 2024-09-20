import axios from 'axios';
import { IKVideo } from 'imagekitio-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {StarRatings} from 'react-star-ratings'
function Show() {
    let location=useLocation();
    let data=location.state;
    let navigate=useNavigate();
    let [rating, setRating]=useState("0");
    let [vid , setVid]=useState({name:"" , username: "" , fileUrl:"", _id:""});
    const params=useParams();
    let [like, setLike]=useState(false);
    useEffect(function (){
        async function getVideo(){
            let res = await axios.get(`http://localhost:8080/show/${data._id}`  ,{withCredentials: true});
            // setVid(res.data.data);
            let {name, fileUrl , coach, _id}=res.data.data;
            let {username}=coach;
            // let id=_id;
            setVid({name,username,fileUrl, _id})
  
        }
        getVideo();
    } , [params])
    const handleVideoLike=async(e)=>{
        try{
            let res=await axios.post("http://localhost:8080/changevideolike", data ,{withCredentials: true})

                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
                    navigate('/login');
                    return;
                }
                navigate('/')
            
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        }  
    }
    const changeRating=(newRating, name)=>{
        setRating(newRating);
    }
  return (
    <div>
        {/* <IKVideo
        path={vid.filePath}
        transformation={[{ "width": "30vw", "height": "30vh" }]}
        controls={true}
        /> */}
        <h1>{vid.name}</h1>
        <h3>{vid.username}</h3>
        <video src={vid.fileUrl}  width="30%" height="20%" controls />
        <button onClick={handleVideoLike}>Add to likes</button>
        <form action="">
            <label htmlFor="rating">Rating</label>
            <div>
           
            </div>
            <label htmlFor="review">Review</label>
            <textarea name="review" id="" placeholder='Enter your review here' cols="30" rows="10"></textarea>
        </form>
    </div>
  )
}

export default Show