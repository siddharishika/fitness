import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import ShowProgram from "./ShowProgram";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import { useRef } from 'react';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function AllPrograms() {
  let navigate = useNavigate();
  let [programs, setPrograms] = useState([]);
  let programImageRef = useRef("");
  function fn(res) {
    if (
      res.data.success == false &&
      res.data.message == "You need to be authenticated to access this page!"
    ) {
      navigate("/login");
    }
  }
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
        {programs && programs.map((program, idx) => (
          <Card
            key={idx}
            style={{ cursor: "pointer" }}
            onClick={() => showProgram(program)}
          >
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
                {program.rating === 0 ? (
                  <span>No Ratings Yet</span>
                ) : (
                  <span>{program.currentRating}</span>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </CardGroup>
    </div>
  );
}

export default AllPrograms