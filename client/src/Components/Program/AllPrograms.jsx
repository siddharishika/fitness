import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import ShowProgram from "./ShowProgram";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import '../../App.css';
import StarRatingDisplay from '../Utils/StarRatingDisplay';
import { getProgramImage } from '../Utils/getProgramImage';
import { useRef } from 'react';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function AllPrograms() {
  let navigate = useNavigate();
  let [programs, setPrograms] = useState([]);
  let programImageRef = useRef("");
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
      <CardGroup>
      <div className="cards-container">
        {programs && programs.map((program, idx) => (
          <Card
            key={idx}
            style={{ padding: '10px', border: "2px solid #A7C7E7" ,borderRadius: "10px", cursor: "pointer" }}
            onClick={() => showProgram(program)}
          >
            <Card.Img
              variant="top"
              onClick={(e) => showProgram(program)}
              ref={programImageRef}
              key={idx}
              p={program._id}
              src={getProgramImage(program)}
              alt={program.name || 'Program image'}
              height="300"
              width="400"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            <Card.Body>
              <Card.Title>{program.name}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {program.description}
                <br />
                <strong>Equipment:</strong>{" "}
                {program && program.equipment && program.equipment.map((equip, i) => (
                  <span key={i}>
                    {equip}
                    {i < program.equipment.length - 1 ? ", " : ""}
                  </span>
                ))}
                <br />
                <strong>Type:</strong>{" "}
                {program && program.typeOfProgram && program.typeOfProgram.map((typ, i) => (
                  <span key={i}>
                    {typ}
                    {i < program.typeOfProgram.length - 1 ? ", " : ""}
                  </span>
                ))}
                <br />
                <strong>Days:</strong> {program.numberOfDays}
                <br />
                <strong>Time per day:</strong> {program.timePerDay}
                <br />
                <strong>Rating:</strong>{" "}
                {program.currentRating > 0 ? (
                  <StarRatingDisplay rating={program.currentRating} />
                ) : (
                  <span>No Ratings Yet</span>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      </CardGroup>
    </div>
  );
}

export default AllPrograms