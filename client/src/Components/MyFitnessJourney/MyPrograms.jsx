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
import { getProgramImage } from "../Utils/getProgramImage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function MyPrograms() {
  let navigate = useNavigate();
  let [data, setData] = useState([]);
  const { user } = useAuth();
  const { redirectToLogin, handleAuthResponse } = useLoginPrompt();
  const userIsCoach = isCoach(user);
  const { requestDelete, deleteModalProps } = useConfirmDelete();
  useEffect(function () {
    async function getMyVideos() {
      let res = await axios.get(`${API_BASE_URL}/getmyprograms`, {
        withCredentials: true,
      });

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }

      setData(res.data.data);
    }
    getMyVideos();
  }, []);
  const performDelete = async (program) => {
    let res = await axios.delete(
      `${API_BASE_URL}/deleteprogram/${program._id}`,
      { withCredentials: true },
    );
    if (handleAuthResponse(res, { redirect: true })) {
      return;
    }
    setData((prev) => prev.filter((p) => p._id !== program._id));
  };

  const handleDelete = (program) => {
    if (!user) {
      redirectToLogin();
      return;
    }
    requestDelete({
      itemLabel: "program",
      itemName: program.name,
      onConfirm: async () => {
        try {
          await performDelete(program);
        } catch (e) {
          if (handleAuthResponse(e, { redirect: true })) {
            return;
          }
        }
      },
    });
  };
  const handleEdit = (program) => {
    if (!user) {
      redirectToLogin();
      return;
    }
    navigate("/program/edit", { state: program });
  };
  const handleShowProgram = (program) => {
    navigate(`/showprogram`, { state: program });
  };
  const handleAddProgram = () => {
    navigate("/program/add");
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
          <h1 style={{ margin: 0 }}>My Programs</h1>
          {userIsCoach && (
            <Button
              variant="light"
              style={submitBtnStyle}
              onClick={handleAddProgram}
            >
              Add Program
            </Button>
          )}
        </div>
        <br />
        {data && data.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {data.map((program, idx) => {
                return (
                  <Card
                    key={idx}
                    onClick={() => handleShowProgram(program)}
                    style={{
                      padding: "10px",
                      border: "2px solid #A7C7E7",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={getProgramImage(program)}
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
                  No programs yet
                </Card.Title>
                <Card.Text style={{ color: "#f4f4f8" }}>
                  Add programs to see them here.
                </Card.Text>
                {userIsCoach && (
                  <Button
                    variant="light"
                    style={submitBtnStyle}
                    onClick={handleAddProgram}
                  >
                    Add Program
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

export default MyPrograms;
