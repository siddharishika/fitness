import axios from 'axios';
import { IKImage, IKVideo } from 'imagekitio-react';
 
import React, { useEffect, useRef, useState } from "react";
import Show from "./Show";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import '../../App.css';
import StarRatingDisplay from '../Utils/StarRatingDisplay';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
// import {useHistory} from 'react-router-dom';
function AllVideos() {
  let navigate = useNavigate();

  let imgRef = useRef("");

  let [fitnessVideo, setVideo] = useState([]);
  // const history = useHistory();
  useEffect(function () {
    async function getVideo() {
      let res = await axios.get(`${API_BASE_URL}/allvideos`, {
        withCredentials: true,
      });
      setVideo(res.data.data);
    }
    getVideo();
  }, []);

  const showVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };

  return (
    <div>
      <CardGroup>
      <div className="cards-container">
        {fitnessVideo && fitnessVideo.map(function (vid, idx) {
          return (
            <Card key={idx}
              style={{ padding: '10px', border: "2px solid #A7C7E7" ,borderRadius: "10px", cursor: "pointer" }}>
              <Card.Img
                  variant="top"
                  onClick={(e) => showVideo(vid)}
                  ref={imgRef}
                  key={idx}
                  p={vid._id}
                  src={vid.imgFileUrl}
                  alt=""
                  height="300"
                  width="400"
                />
                <Card.Body>
                  <Card.Title>
                    <i>{vid.name}</i>
                  </Card.Title>
                  <Card.Text>
                    <i>Coach: {vid.coach && vid.coach.username}</i>
                    <br />
                    Rating:{' '}
                    {vid.currentRating > 0 ? (
                      <StarRatingDisplay rating={vid.currentRating} />
                    ) : (
                      <span>No ratings yet</span>
                    )}
                  </Card.Text>
                </Card.Body>
                {/* <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer> */}
            </Card>
          );
        })}
      </div>
      </CardGroup>
    </div>
  );
}

export default AllVideos