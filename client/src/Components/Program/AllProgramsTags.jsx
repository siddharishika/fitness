import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
// import {useHistory} from 'react-router-dom';
function AllProgramsTags(tags) {
  let navigate=useNavigate();
  let programImageRef = useRef("");

  let [tagsProgram, setTagsProgram] = useState({});
  console.log("This is tags", tags.tags);

    useEffect(() => {
    async function fetchPrograms() {
      tags=tags.tags || [];
      tags.map((tag) => {
        setTagsProgram(prev => ({...prev, [tag]: []})); 
      });
      let tagsObj = {};
      for (const tag of tags) {
        const res = await axios.get(`${API_BASE_URL}/allprograms/${tag}`, { withCredentials: true });
        tagsObj[tag] = res.data.data;
      }
      console.log("Tags Object:", tagsObj);
      setTagsProgram(tagsObj);
    }
    fetchPrograms();
  }, [tags]);

  const showProgram=(program)=>{
    navigate(`/showprogram`, { state: program });
  }
  
  
  return (
    <div>

      {
        Object.entries(tagsProgram).map(([tag, programs]) => (
          programs.length > 0 && (
            <div key={tag}>
              <h3>{tag}</h3>
              <CardGroup>
              {programs && programs.map((program, idx) => (
                <div key={program._id || idx}>
                <Card>
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
                  />
                  <Card.Body>
                    <Card.Title>{program.name}</Card.Title>
                    <Card.Text>
                      <br />
                      <i>Coach: {program.coach && program.coach.username}</i>
                      <br />
                      Rating: {program.currentRatingCount > 0 ? <span>{program.currentRating}</span> : <span>No ratings yet</span>}
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

export default AllProgramsTags