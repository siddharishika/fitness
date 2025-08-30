import axios from 'axios';
import { IKImage, IKVideo } from 'imagekitio-react';
 
import React, { useEffect, useRef, useState } from "react";
import Show from './Show';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
// import {useHistory} from 'react-router-dom';
function AllVideosTags(tags) {
  let navigate=useNavigate();

  let imgRef=useRef("");
  
  let [fitnessVideo, setVideo] = useState([]);

  let [tagsVideo, setTagsVideo] = useState({});
  console.log("This is tags", tags.tags);

    useEffect(() => {
    async function fetchVideos() {
      tags=tags.tags || [];
      tags.map((tag) => {
        setTagsVideo(prev => ({...prev, [tag]: []})); 
      });
      let tagsObj = {};
      for (const tag of tags) {
        const res = await axios.get(`http://localhost:8080/allvideos/${tag}`, { withCredentials: true });
        tagsObj[tag] = res.data.data;
      }
      console.log("Tags Object:", tagsObj);
      setTagsVideo(tagsObj);
    }
    fetchVideos();
  }, [tags]);

  const showVideo=(ele)=>{
    navigate(`/show` , {state:ele});
  }
  
  
  return (
    <div>

      {
        Object.entries(tagsVideo).map(([tag, videos]) => (
          videos.length > 0 && (
            <div key={tag}>
              <h3>{tag}</h3>
              <CardGroup>
              {videos && videos.map((video, idx) => (
                <div key={video._id || idx}>
                <Card>
                  <Card.Img variant="top" onClick={() => showVideo(video)}
                    src={video.imgFileUrl}
                    alt=""
                    height="300"
                    width="400" />
                  <Card.Body>
                    <Card.Title>{video.name}</Card.Title>
                    <Card.Text>
                      <br />
                      <i>Coach: {video.coach && video.coach.username}</i>
                      <br />
                      Rating: {video.rating === 0 ? <Card.Text>No ratings yet</Card.Text> : <Card.Text>{video.rating}</Card.Text>}
                      <br />
                    </Card.Text>
                  </Card.Body>
                
                </Card>
                </div>
                
              ))}
              </CardGroup>
            </div>
          )
        ))
      }
    </div>
  )
}

export default AllVideosTags