import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faStar } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from "react";
import { Card, CardGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Home() {
  let navigate = useNavigate();

  let imgRef = useRef("");
  let programImageRef = useRef("");

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
  console.log("This is fitness video", fitnessVideo);
  const showVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };
  let [programs, setPrograms] = useState([]);
  useEffect(function () {
    async function getProgram() {
      let res = await axios.get(`${API_BASE_URL}/allprograms`, {
        withCredentials: true,
      });
      // setVideo(res.data.data);
      setPrograms(res.data.data);
    }
    getProgram();
  }, []);
  const showProgram = (program) => {
    navigate(`/showprogram`, { state: program });
  };

  return (
    <div>
      <h2>Workout Videos</h2>
      <br />
        <CardGroup style={{}} >
        {fitnessVideo && fitnessVideo.map(function (vid, idx) {
          return (
            <Card key={idx} style={{ padding: '10px', border: "2px solid #A7C7E7" ,borderRadius: "10px"  }}>  
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
                style={{  padding: '10px', }}
              />
              <Card.Body>
                <Card.Title>
                  <i>{vid.name} by {vid.coach && vid.coach.username}</i>
                </Card.Title>
                <Card.Text>
                  {vid.currentRatingCount > 0 ? (
                    <span>
                      {vid.currentRating}
                      <FontAwesomeIcon icon={faStar} style={{color: "rgb(255, 212, 59)", width: "20px", height: "20px"}} />
                    </span>
                  ) : (
                    <i>No ratings yet</i>
                  )}
                </Card.Text>
              </Card.Body>
              {/* <Card.Footer>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </Card.Footer> */}
            </Card>
          );
        })}
      </CardGroup>
      <br />
      <br />
      <h2>Workout Programs</h2>
      <br />
      <CardGroup style={{}} >
        {programs && programs.map(function (program, idx) {
          return (
            <Card key={idx} style={{  padding: '10px', border: "2px solid #A7C7E7" ,borderRadius: "10px" }}>
              <Card.Img
                variant="top"
                onClick={(e) => showProgram(program)}
                ref={programImageRef}
                key={idx}
                p={program._id}
                src={program.file}
                alt={program.file}
                height="300"
                width="400"
                style={{ padding: '10px' }}
              />
              <Card.Body>
                <Card.Title>
                  <i>{program.name} by {program.coach && program.coach.username}</i>
                </Card.Title>
                <Card.Text>
                  {program.currentRatingCount > 0 ? (
                    <span>
                      {program.currentRating}
                      <FontAwesomeIcon icon={faStar} style={{color: "rgb(255, 212, 59)", width: "20px", height: "20px"}} />
                    </span>
                    
                  ) : (
                    <i>No ratings yet</i>
                  )}
                  
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