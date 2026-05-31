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

function LikedVideos() {
  let [data, setData] = useState([]);
  let navigate = useNavigate();
  const { handleAuthResponse } = useLoginPrompt();
  useEffect(function () {
    async function getLikedVideos() {
      let res = await axios.get(`${API_BASE_URL}/getlikedvideos`, {
        withCredentials: true,
      });

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }

      setData(res.data.data);
    }
    getLikedVideos();
  }, []);
  const handleShow = (vid) => {
    navigate("/show", { state: vid });
  };
  return (
    <>
      <div>
        <h1>My Liked Videos</h1>
        <br />
        {data && data.likedVideos && data.likedVideos.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {data.likedVideos.map((vid, idx) => {
                return (
                  <Card
                    key={idx}
                    style={{
                      padding: "10px",
                      border: "2px solid #A7C7E7",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleShow(vid)}
                  >
                    <Card.Img
                      variant="top"
                      src={vid.imgFileUrl}
                      alt={vid.name || "Video image"}
                      height="300"
                      width="400"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{vid.name}</Card.Title>
                      <div style={{ color: "#f4f4f8" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>{vid.tags?.join(" • ")}</div>
                          <h5
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              margin: 0,
                            }}
                          >
                            Ratings:
                            {vid.currentRating > 0 ? (
                              <span
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  alignItems: "flex-start",
                                  flexWrap: "wrap",
                                }}
                              >
                                {[...Array(Math.round(vid.currentRating))].map(
                                  (_, i) => (
                                    <FontAwesomeIcon
                                      key={i}
                                      icon={faStar}
                                      style={{
                                        color: "rgb(255, 212, 59)",
                                        fontSize: "clamp(12px, 1.6vw, 20px)",
                                      }}
                                    />
                                  ),
                                )}
                              </span>
                            ) : (
                              <span style={{ color: "#A7C7E7" }}>
                                No Ratings Yet
                              </span>
                            )}
                          </h5>
                        </div>
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
                  No liked videos yet
                </Card.Title>
                <Card.Text style={{ color: "#f4f4f8" }}>
                  Like videos to see them here.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default LikedVideos;
