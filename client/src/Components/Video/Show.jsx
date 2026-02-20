import axios from 'axios';
import { IKVideo } from 'imagekitio-react';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Rating from '../Utils/Rating';
import VideoPlayer from '../Utils/VideoPlayer';
import { useAuth } from '../Utils/AuthProvider';
import { useRef } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Show() {
  let location = useLocation();
  let data = location.state;
  let navigate = useNavigate();
  let [vid, setVid] = useState({
    name: "",
    username: "",
    fileUrl: "",
    _id: "",
  });
  const params = useParams();
  let [like, setLike] = useState(false);
  let [newrating, setNewRating] = useState(vid.currentRating); 
  let reviewRef = useRef(null);
  useEffect(
    function () {
      async function getVideo() {
        let res = await axios.get(`${API_BASE_URL}/show/${data._id}`, {
          withCredentials: true,
        });
        // setVid(res.data.data);
        let { name, fileUrl, coach, _id, rating, reviews, currentRating, currentRatingCount} = res.data.data;
        let { username, _id: coachId } = coach || {};
        // store coach id so we can check ownership on client
        setVid({
          name,
          username,
          fileUrl,
          _id,
          coachId,
          rating,
          reviews,
          currentRating,
          currentRatingCount,
        });
      }
      getVideo();
    },
    [params]
  );
  const handleVideoLike = async (e) => {
    try {
      let res = await axios.post(`${API_BASE_URL}/changevideolike`, data, {
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
  const { user } = useAuth();
  const handleEditVideo = () => {
    navigate(`/edit`, { state: vid });
  };

  const handleVideoDelete = async () => {
    try {
      let res = await axios.post(`${API_BASE_URL}/deletevideo/${vid._id}`, vid, { 
        withCredentials: true,
      });
      if ( res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!") {
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
    try {
      const reviewText = reviewRef.current ? reviewRef.current.value : "";
      console.log("Submitting review:", reviewText);
      let res = await axios.post(`${API_BASE_URL}/video/addreview/${vid._id}`, {review: reviewText }, {
      withCredentials: true,
      });
      if (
      res.data.success == false &&
      res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/show", { state: vid });
      reviewRef.current.value = "";
    }catch (e) {
      console.log(e, "Nahi ho payega"); 
    }
  }
  


  const isOwner = user && vid.coachId && String(user._id) === String(vid.coachId);
  console.log("Rating in show:", newrating);
  return (
    <div>
      <h1>{vid.name}</h1>
      <VideoPlayer url={vid.fileUrl} />
      <h3>Coach: {vid.username}</h3>
      <h3>Current Rating: {vid.currentRating}</h3>
      <button onClick={handleVideoLike}>Add to likes</button>
      {isOwner && (
        <>
          <button onClick={handleEditVideo}>Edit Video</button>
          <button onClick={handleVideoDelete}>Delete Video</button>
        </>
      )}
      {!isOwner && <>
      <h3>Rate this video</h3>
      <Rating videoId={vid._id} currentRating={vid.currentRating} currentRatingCount={vid.currentRatingCount} isVideo={true} />
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
      </>}
      <>
      {vid && vid.reviews && vid.reviews.map((rev, i) => {
        return (
          <div key={i}>
            <h4>{rev.user.username}</h4>
            <p>{rev.review}</p>
          </div>
        );
      })}
      </>
    </div>
  );
}

export default Show