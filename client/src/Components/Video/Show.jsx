import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Rating from '../Utils/Rating';
import VideoPlayer from '../Utils/VideoPlayer';
import { useAuth } from '../Utils/AuthProvider';
import { useRef } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

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
        let { name, fileUrl, coach, _id, rating, reviews, currentRating, tags, currentRatingCount} = res.data.data;
        let { username, _id: coachId } = coach || {};
        // store coach id so we can check ownership on client
        setVid({
          name,
          username,
          fileUrl,
          _id,
          tags,
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
    <>
      <div style={{
        backgroundColor: "#A7C7E7",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1
      }} />
      <div className='mx-auto p-4 rounded' style={{ position: "relative", zIndex: 1 }}>
        <h1>{vid.name} by {vid.username}</h1>
        <Card style={{padding: "20px"}}>
          <VideoPlayer url={vid.fileUrl}  />
          <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
            <i>{vid.currentRating}</i>
            <FontAwesomeIcon icon={faStar} style={{color: "rgb(255, 212, 59)", width: "20px", height: "20px"}} />
            <Button variant="light" style={{ border:"2px solid black" }}  onClick={handleVideoLike}>Add to likes</Button>
            {isOwner && (
              <>
                <Button variant="light" style={{ border:"2px solid black" }} onClick={handleEditVideo}>Edit Video</Button>
                <Button variant='light'style={{ border:"2px solid red" }} onClick={handleVideoDelete}>Delete Video</Button>
              </>
            )}
          </span>
        </Card>
        <br />
        <br />
        {!isOwner && <>
          <h3><i>Rate this video</i></h3>
          <Rating videoId={vid._id} currentRating={vid.currentRating} currentRatingCount={vid.currentRatingCount} isVideo={true} />
          <br />
          <br />
          <Form onSubmit={handleReviewSubmit} className="p-4 border rounded"  method="POST">
            <Form.Label><h3><i>Leave a review</i></h3></Form.Label>
            <InputGroup style={{padding: "10px"}} >
              <Form.Control as="textarea" aria-label="With textarea" placeholder="Enter your review here" name="review" ref={reviewRef} />
            </InputGroup>
            <Button type="submit" variant='light' style={{border: "2px solid black"}} className='w-100' >Submit</Button>
          </Form>
        </>}
        <>
          <br />
          <br />
          <h2><i>Comments</i></h2>
          {vid && vid.reviews && vid.reviews.map((rev, i) => {
            return (
              <>
                <Card key={i} style={{padding:"5px", border: "1px solid black" }} >
                  <Card.Text> <strong><i>{rev.user.username}</i></strong></Card.Text>
                  <Card.Title>{rev.review}</Card.Title>
                </Card>
                <br />
                <br />
              </>
            );
          })}
        </>
      </div>
    </>
  );
}

export default Show