import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardGroup, Button } from "react-bootstrap";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Utils/AuthProvider";
import isCoach from "../Utils/isCoach";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import { useConfirmDelete } from "../Utils/useConfirmDelete";
import ConfirmDeleteModal from "../Utils/ConfirmDeleteModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function MyVideos() {
  let [vids, setVids] = useState([]);
  let navigate = useNavigate();
  const { user } = useAuth();
  const { redirectToLogin, handleAuthResponse } = useLoginPrompt();
  const userIsCoach = isCoach(user);
  const { requestDelete, deleteModalProps } = useConfirmDelete();
  useEffect(function () {
    async function getMyVideos() {
      let res = await axios.get(`${API_BASE_URL}/getall`, {
        withCredentials: true,
      });

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      setVids(res.data.data);
    }
    getMyVideos();
  }, []);
  const performDelete = async (vid) => {
    let res = await axios.delete(`${API_BASE_URL}/delete/${vid._id}`, {
      withCredentials: true,
    });

    if (handleAuthResponse(res, { redirect: true })) {
      return;
    }
    setVids((prev) => prev.filter((v) => v._id !== vid._id));
  };

  const handleDelete = (vid) => {
    if (!user) {
      redirectToLogin();
      return;
    }
    requestDelete({
      itemLabel: "video",
      itemName: vid.name,
      onConfirm: async () => {
        try {
          await performDelete(vid);
        } catch (e) {
          if (handleAuthResponse(e, { redirect: true })) {
            return;
          }
        }
      },
    });
  };
  const handleEdit = (vid) => {
    if (!user) {
      redirectToLogin();
      return;
    }
    navigate("/video/edit", { state: vid });
  };
  const handleShowVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };
  const handleAddVideo = () => {
    navigate("/video/add");
  };
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 style={{ margin: 0 }}>My Videos</h1>
          {userIsCoach && (
            <Button
              variant="light"
              style={submitBtnStyle}
              onClick={handleAddVideo}
            >
              Add Video
            </Button>
          )}
        </div>
        <br />
        {vids && vids.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {vids.map((vid, idx) => {
                return (
                  <Card
                    key={idx}
                    onClick={() => handleShowVideo(vid)}
                    style={{
                      padding: "10px",
                      border: "2px solid #A7C7E7",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
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
                  No videos yet
                </Card.Title>
                <Card.Text style={{ color: "#f4f4f8" }}>
                  Upload videos to see them here.
                </Card.Text>
                {userIsCoach && (
                  <Button
                    variant="light"
                    style={submitBtnStyle}
                    onClick={handleAddVideo}
                  >
                    Add Video
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
      <ConfirmDeleteModal {...deleteModalProps} />
    </>
  );
}

export default MyVideos;
