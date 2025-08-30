import axios from 'axios';
 
import React, { useEffect, useRef, useState } from "react";
import { Card, CardGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Home() {
  let navigate = useNavigate();

  let imgRef = useRef("");

  let [fitnessVideo, setVideo] = useState([]);
  console.log("API BASE URL", `${API_BASE_URL}/allvideos`);
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
  console.log("This is fitness video", fitnessVideo);
  const showVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };

  return (
    <div>
      <h2>Workout Videos</h2>
      <br />
      <CardGroup>
        {fitnessVideo && fitnessVideo.map(function (vid, idx) {
          return (
            <Card key={idx}>
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
                  Rating: {vid.rating == 0 && <div>No ratings yet</div>}
                  {vid.rating > 0 && <div>{vid.rating}</div>}
                </Card.Text>
              </Card.Body>
              {/* <Card.Footer>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </Card.Footer> */}
            </Card>
          );
        })}
      </CardGroup>
      <h2>Workout Videos</h2>
      <br />
      <CardGroup>
        {fitnessVideo && fitnessVideo.map(function (vid, idx) {
          return (
            <Card key={idx}>
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
                  Rating: {vid.rating == 0 && <div>No ratings yet</div>}
                  {vid.rating > 0 && <div>{vid.rating}</div>}
                </Card.Text>
              </Card.Body>
              {/* <Card.Footer>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </Card.Footer> */}
            </Card>
          );
        })}
      </CardGroup>
    </div>
  );
}

export default Home