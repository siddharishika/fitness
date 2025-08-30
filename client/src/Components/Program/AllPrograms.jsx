import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import ShowProgram from "./ShowProgram";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function AllPrograms() {
  let navigate = useNavigate();
  let [programs, setPrograms] = useState([]);
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
              src="https://plus.unsplash.com/premium_photo-1670505060574-b08479270d1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              height="150"
              width="150"
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
                  <span>{program.rating}</span>
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