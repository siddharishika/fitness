import axios from 'axios';
import { IKVideo } from 'imagekitio-react';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Rating from '../Utils/Rating';
import VideoPlayer from '../Utils/VideoPlayer';

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
  useEffect(
    function () {
      async function getVideo() {
        let res = await axios.get(`${API_BASE_URL}/show/${data._id}`, {
          withCredentials: true,
        });
        // setVid(res.data.data);
        let { name, fileUrl, coach, _id, rating, reviews, currentRating, currentRatingCount} = res.data.data;
        let { username } = coach;
        // let id=_id;
        setVid({
          name,
          username,
          fileUrl,
          _id,
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
  console.log("Rating in show:", newrating);
  return (
    <div>
      <h1>{vid.name}</h1>
      <VideoPlayer url={vid.fileUrl} />
      <h3>Coach: {vid.username}</h3>
      <h3>Current Rating: {vid.currentRating}</h3>
      <button onClick={handleVideoLike}>Add to likes</button>
      <h3>Rate this video</h3>
      <Rating videoId={vid._id} currentRating={vid.currentRating} currentRatingCount={vid.currentRatingCount} isVideo={true} />
      <br />
      <br />
      <form action="">
        <label htmlFor="review">Review</label>
        <textarea
          name="review"
          id=""
          placeholder="Enter your review here"
          cols="30"
          rows="10"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Show