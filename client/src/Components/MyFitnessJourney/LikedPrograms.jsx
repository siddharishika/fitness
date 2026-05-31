import axios from "axios";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardGroup } from "react-bootstrap";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLoginPrompt } from "../Utils/useLoginPrompt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function LikedPrograms() {
  let [data, setData] = useState({});
  let navigate = useNavigate();
  const { handleAuthResponse } = useLoginPrompt();
  useEffect(function () {
    async function getLikedVideos() {
      let res = await axios.get(`${API_BASE_URL}/getlikedprograms`, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      setData(res.data.data);
    }
    getLikedVideos();
  }, []);
  const handleShowProgram = (program) => {
    navigate("/showprogram", { state: program });
  };
  return (
    <>
      <div>
        <h1>My Liked Programs</h1>
        <br />
        {data && data.likedPrograms && data.likedPrograms.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {data.likedPrograms.map((program, idx) => {
                return (
                  <Card
                    key={idx}
                    style={{
                      padding: "10px",
                      border: "2px solid #A7C7E7",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleShowProgram(program)}
                  >
                    <Card.Img
                      variant="top"
                      src={program.file}
                      alt={program.name || "Program image"}
                      height="300"
                      width="400"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{program.name}</Card.Title>
                      <div style={{ color: "#f4f4f8" }}>
                        <strong>Number of days:</strong> {program.numberOfDays}
                        <br />
                        <strong>Equipment:</strong>{" "}
                        {program.equipment?.join(" • ")}
                        <br />
                        <h5
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "8px",
                          }}
                        >
                          Rating:
                          {program.currentRating > 0 ? (
                            <span
                              style={{
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {[
                                ...Array(Math.round(program.currentRating)),
                              ].map((_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={faStar}
                                  style={{
                                    color: "rgb(255, 212, 59)",
                                    fontSize: "clamp(12px, 1.6vw, 20px)",
                                  }}
                                />
                              ))}
                              <span style={{ marginLeft: "6px" }}>
                                {program.currentRating}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: "#A7C7E7" }}>
                              No Ratings Yet
                            </span>
                          )}
                        </h5>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </CardGroup>
        ) : (
          <div style={{ padding: "20px" }}>
            <Card
              style={{
                border: "2px solid #A7C7E7",
                backgroundColor: "#161823",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "#A7C7E7" }}>
                  No liked programs yet
                </Card.Title>
                <Card.Text style={{ color: "#f4f4f8" }}>
                  Like programs to see them here.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default LikedPrograms;
