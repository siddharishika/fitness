import axios from "axios";

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import RatingPrograms from "./RatingPrograms";
import { useAuth } from "../Utils/AuthProvider";
import { IoSwapHorizontalOutline } from "react-icons/io5";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import { isAuthorContentError } from "../Utils/authorContent";
import AuthorContentModal from "../Utils/AuthorContentModal";
import ConfirmDeleteModal from "../Utils/ConfirmDeleteModal";
import { useConfirmDelete } from "../Utils/useConfirmDelete";
import isCoach from "../Utils/isCoach";
import ReviewComment from "../Utils/ReviewComment";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function ShowProgram() {
  let location = useLocation();
  let initialProgram = location.state;
  let [program, setProgram] = useState(initialProgram);
  let [selectedValue, setSelect] = useState(0);
  const params = useParams();
  let [vids, setVids] = useState([]);
  let [show, setShow] = useState(null);
  let [liked, setLiked] = useState(false);
  let navigate = useNavigate();
  let { user } = useAuth();
  const reviewRef = useRef(null);
  const { promptLogin, redirectToLogin, loginModal, handleAuthResponse } =
    useLoginPrompt();
  const { requestDelete, deleteModalProps } = useConfirmDelete();
  const [showAuthorContent, setShowAuthorContent] = useState(false);
  const coachId = program?.coach?._id ?? program?.coach;
  const isOwner = user && coachId && String(user._id) === String(coachId);
  const canManage = isCoach(user) && isOwner;

  useEffect(
    function () {
      async function getProgram() {
        let res = await axios.get(
          `${API_BASE_URL}/showprogram/${program._id}`,
          { withCredentials: true },
        );
        let { program: updatedProgram, vids } = res.data.data;
        setProgram(updatedProgram);
        setVids(vids);
        setSelect(0);
        setShow(vids?.[0]?.[0] ?? null);
        try {
          let likedRes = await axios.get(`${API_BASE_URL}/getlikedprograms`, {
            withCredentials: true,
          });
          if (
            likedRes.data &&
            likedRes.data.data &&
            Array.isArray(likedRes.data.data.likedPrograms)
          ) {
            const exists = likedRes.data.data.likedPrograms.some(
              (p) => String(p._id) === String(updatedProgram._id),
            );
            setLiked(exists);
          }
        } catch (err) {}
      }
      getProgram();
    },
    [params, initialProgram],
  );

  const handleSelect = (e) => {
    const value = Number(e.target.value);
    setSelect(value);
    setShow(vids[value]);
  };

  const handleShow = (ele) => {
    navigate(`/show`, { state: ele });
  };
  const handleEditProgram = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    navigate(`/program/edit`, { state: program });
  };
  const handleLikedPrograms = async () => {
    if (!user) {
      promptLogin();
      return;
    }
    let data = { program, vids };
    try {
      let res = await axios.post(`${API_BASE_URL}/changeprogramlike`, data, {
        withCredentials: true,
      });

      if (handleAuthResponse(res)) {
        return;
      }
      setLiked((prev) => !prev);
    } catch (e) {
      if (handleAuthResponse(e)) {
        return;
      }
    }
  };
  const performDeleteProgram = async () => {
    let res = await axios.post(
      `${API_BASE_URL}/deleteprogram/${program._id}`,
      program,
      {
        withCredentials: true,
      },
    );
    if (handleAuthResponse(res, { redirect: true })) {
      return;
    }
    navigate("/");
  };

  const handleDeleteProgram = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    requestDelete({
      itemLabel: "program",
      itemName: program.name,
      onConfirm: async () => {
        try {
          await performDeleteProgram();
        } catch (e) {
          if (handleAuthResponse(e, { redirect: true })) {
            return;
          }
        }
      },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isOwner) {
      setShowAuthorContent(true);
      return;
    }
    if (!user) {
      promptLogin();
      return;
    }
    const reviewText = reviewRef.current ? reviewRef.current.value : "";
    try {
      let res = await axios.post(
        `${API_BASE_URL}/program/addreview/${program._id}`,
        { review: reviewText },
        {
          withCredentials: true,
        },
      );
      if (handleAuthResponse(res)) {
        return;
      }
      if (isAuthorContentError(res)) {
        setShowAuthorContent(true);
        return;
      }
      navigate("/showprogram", { state: program });
      reviewRef.current.value = "";
    } catch (e) {
      if (isAuthorContentError(e)) {
        setShowAuthorContent(true);
        return;
      }
      if (handleAuthResponse(e)) {
        return;
      }
    }
  };

  if (!program) {
    return <div>Loading program...</div>;
  }
  return (
    <>
      <div
        style={{
          backgroundColor: "#0e0f14",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />
      <div
        className="mx-auto p-4 rounded"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#0e0f14",
          color: "#f4f4f8",
        }}
      >
        <h1 style={{ color: "#A7C7E7" }}>{program.name}</h1>
        <Card
          style={{
            border: "5px solid #A7C7E7",
            borderRadius: "10px",
            backgroundColor: "#000000",
          }}
        >
          <Card.Body>
            <Card.Text style={{ color: "#f4f4f8" }}>
              <strong>Equipment:</strong>{" "}
              {program.equipment?.join(" • ") || "No equipment required"}
            </Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}>
              <strong>Days:</strong> {program.numberOfDays}
            </Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}>
              <strong>Time/Day:</strong> {program.timePerDay}
            </Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}>
              <strong>Tags:</strong> {program.tags?.join(" • ")}
            </Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}>
              <strong>Description:</strong> {program.description}
            </Card.Text>
            <Card.Text>
              {program.currentRating > 0 ? (
                <StarRatingDisplay
                  rating={program.currentRating}
                  fontSize="clamp(14px, 2.5vw, 28px)"
                />
              ) : (
                <span style={{ color: "#f4f4f8" }}>No ratings yet</span>
              )}
            </Card.Text>
            <div style={{ color: "#f4f4f8", marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Button
                  variant="light"
                  style={{
                    border: "2px solid #A7C7E7",
                    backgroundColor: "#161823",
                    color: "#A7C7E7",
                  }}
                  onClick={handleLikedPrograms}
                >
                  {liked
                    ? "Remove from Liked Programs"
                    : "Add to Liked Programs"}
                </Button>
                {canManage && (
                  <>
                    <Button
                      variant="light"
                      style={{
                        border: "2px solid #A7C7E7",
                        backgroundColor: "#161823",
                        color: "#A7C7E7",
                      }}
                      onClick={handleEditProgram}
                    >
                      Edit Program
                    </Button>
                    <Button
                      variant="light"
                      style={{
                        border: "2px solid #A7C7E7",
                        backgroundColor: "#161823",
                        color: "#A7C7E7",
                      }}
                      onClick={handleDeleteProgram}
                    >
                      Delete Program
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        <br />
        {program?.schedule ? (
          program.schedule.map((day, idx) =>
            day && day.length > 0 ? (
              <React.Fragment key={`day-${idx}`}>
                <Card
                  style={{
                    border: "2px solid #A7C7E7",
                    borderRadius: "10px",
                    backgroundColor: "#000000",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow(program.schedule[idx][0])}
                >
                  <Card.Body>
                    <Card.Title style={{ color: "#A7C7E7" }}>
                      Day {idx + 1}: {program.schedule[idx][0]?.name}
                    </Card.Title>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <img
                        src={program.schedule[idx][0]?.imgFileUrl}
                        alt=""
                        height="120"
                        width="120"
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                      />
                      <Card.Text style={{ color: "#f4f4f8" }}>
                        {program.schedule[idx][0]?.tags?.join(" • ")}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
                <br />
              </React.Fragment>
            ) : (
              <React.Fragment key={`day-${idx}`}>
                <Card
                  style={{
                    border: "2px solid #A7C7E7",
                    borderRadius: "10px",
                    backgroundColor: "#161823",
                  }}
                >
                  <Card.Body>
                    <Card.Title style={{ color: "#A7C7E7" }}>
                      Day {idx + 1}: Rest Day
                    </Card.Title>
                    <Card.Text style={{ color: "#f4f4f8" }}>
                      No workout scheduled for this day
                    </Card.Text>
                  </Card.Body>
                </Card>
                <br />
              </React.Fragment>
            ),
          )
        ) : (
          <Card
            style={{
              border: "2px solid #A7C7E7",
              borderRadius: "10px",
              backgroundColor: "#000000",
            }}
          >
            <Card.Body>
              <Card.Title style={{ color: "#A7C7E7" }}>
                No schedule available
              </Card.Title>
            </Card.Body>
          </Card>
        )}
        <br />
        {!isOwner && (
          <div
            style={{
              border: "2px solid #A7C7E7",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#A7C7E7",
            }}
          >
            <h3 style={{ color: "#1f2532" }}>
              <i>Rate this program</i>
            </h3>
            <RatingPrograms
              programId={program._id}
              currentRating={program.currentRating}
              currentRatingCount={program.currentRatingCount}
              contentRatings={program.rating}
              isProgram={true}
              isAuthenticated={!!user}
              isOwner={isOwner}
              onRequireLogin={promptLogin}
            />
            <br />
            <br />
            <Form onSubmit={handleReviewSubmit} method="POST">
              <Form.Label>
                <h3 style={{ color: "#1f2532" }}>
                  <i>Leave a review</i>
                </h3>
              </Form.Label>
              <InputGroup style={{ padding: "10px" }}>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  placeholder="Enter your review here"
                  name="review"
                  ref={reviewRef}
                />
              </InputGroup>
              <Button
                type="submit"
                variant="light"
                style={{
                  border: "2px solid black",
                  backgroundColor: "#161823",
                  color: "#A7C7E7",
                }}
                className="w-100"
              >
                Submit
              </Button>
            </Form>
          </div>
        )}
        <br />
        <h2 style={{ color: "#A7C7E7" }}>
          <i>Comments</i>
        </h2>
        <div
          style={{
            border: "2px solid #A7C7E7",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#000000",
          }}
        >
          {program &&
            program.reviews &&
            program.reviews.map((rev, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  backgroundColor: "#000000",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <ReviewComment review={rev} />
                {i < program.reviews.length - 1 && (
                  <hr style={{ borderColor: "#A7C7E7", margin: "1%px 0" }} />
                )}
              </div>
            ))}
        </div>
      </div>
      {loginModal}
      <ConfirmDeleteModal {...deleteModalProps} />
      <AuthorContentModal
        show={showAuthorContent}
        onHide={() => setShowAuthorContent(false)}
      />
    </>
  );
}

export default ShowProgram;
