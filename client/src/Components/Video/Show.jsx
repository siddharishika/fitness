import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Rating from "../Utils/Rating";
import StarRatingDisplay from "../Utils/StarRatingDisplay";
import VideoPlayer from "../Utils/VideoPlayer";
import { useAuth } from "../Utils/AuthProvider";
import { useRef } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import { isAuthorContentError } from "../Utils/authorContent";
import AuthorContentModal from "../Utils/AuthorContentModal";
import ConfirmDeleteModal from "../Utils/ConfirmDeleteModal";
import { useConfirmDelete } from "../Utils/useConfirmDelete";
import isCoach from "../Utils/isCoach";
import ReviewComment from "../Utils/ReviewComment";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Show() {
  let location = useLocation();
  let data = location.state;
  let navigate = useNavigate();
  let [vid, setVid] = useState(null);
  let [loading, setLoading] = useState(true);
  const params = useParams();
  let [liked, setLiked] = useState(false);
  let reviewRef = useRef(null);
  const { user } = useAuth();
  const { promptLogin, redirectToLogin, loginModal, handleAuthResponse } =
    useLoginPrompt();
  const { requestDelete, deleteModalProps } = useConfirmDelete();
  const [showAuthorContent, setShowAuthorContent] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const videoId = data?._id || params?.id;

  useEffect(
    function () {
      async function getVideo() {
        if (!videoId) {
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          let res = await axios.get(`${API_BASE_URL}/show/${videoId}`, {
            withCredentials: true,
          });
          let {
            name,
            fileUrl,
            coach,
            _id,
            rating,
            reviews,
            currentRating,
            tags,
            currentRatingCount,
          } = res.data.data;
          let { username, _id: coachId } = coach || {};
          setVid({
            name,
            username,
            fileUrl,
            _id,
            tags,
            coachId,
            rating,
            reviews,
            currentRating,
            currentRatingCount,
          });
          try {
            let likedRes = await axios.get(`${API_BASE_URL}/getlikedvideos`, {
              withCredentials: true,
            });
            if (likedRes.data?.data?.likedVideos) {
              const exists = likedRes.data.data.likedVideos.some(
                (v) => String(v._id) === String(_id),
              );
              setLiked(exists);
            }
          } catch (err) {}
        } catch (err) {
        } finally {
          setLoading(false);
        }
      }
      getVideo();
    },
    [videoId],
  );
  const handleVideoLike = async (e) => {
    if (!user) {
      promptLogin();
      return;
    }
    try {
      let res = await axios.post(`${API_BASE_URL}/changevideolike`, vid, {
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
  const handleEditVideo = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    navigate(`/video/edit`, { state: vid });
  };

  const performVideoDelete = async () => {
    const res = await axios.delete(`${API_BASE_URL}/delete/${vid._id}`, {
      withCredentials: true,
    });
    if (handleAuthResponse(res, { redirect: true })) {
      return;
    }
    navigate("/");
  };

  const handleVideoDelete = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    setDeleteError("");
    requestDelete({
      itemLabel: "video",
      itemName: vid.name,
      onConfirm: async () => {
        try {
          await performVideoDelete();
        } catch (e) {
          if (handleAuthResponse(e, { redirect: true })) {
            return;
          }
          const msg =
            e?.response?.data?.message ||
            e?.response?.data?.msg ||
            "Could not delete this video. Please try again.";
          setDeleteError(msg);
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
    try {
      const reviewText = reviewRef.current ? reviewRef.current.value : "";
      let res = await axios.post(
        `${API_BASE_URL}/video/addreview/${vid._id}`,
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
      const refreshRes = await axios.get(`${API_BASE_URL}/show/${vid._id}`, {
        withCredentials: true,
      });
      const {
        name,
        fileUrl,
        coach,
        _id,
        rating,
        reviews,
        currentRating,
        tags,
        currentRatingCount,
      } = refreshRes.data.data;
      const { username, _id: coachId } = coach || {};
      setVid({
        name,
        username,
        fileUrl,
        _id,
        tags,
        coachId,
        rating,
        reviews,
        currentRating,
        currentRatingCount,
      });
      if (reviewRef.current) {
        reviewRef.current.value = "";
      }
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

  const isOwner =
    user && vid?.coachId && String(user._id) === String(vid.coachId);
  const canManage = isCoach(user) && isOwner;

  if (!videoId) {
    return (
      <div className="mx-auto p-4 rounded" style={{ color: "#A7C7E7" }}>
        No video selected. Go back and choose a video to watch.
      </div>
    );
  }

  if (loading || !vid) {
    return (
      <div className="mx-auto p-4 rounded" style={{ color: "#A7C7E7" }}>
        Loading video…
      </div>
    );
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
        style={{ position: "relative", zIndex: 1 }}
      >
        <h1 style={{ color: "#A7C7E7" }}>
          {vid.name} by {vid.username}
        </h1>
        <Card style={{ border: "5px solid #A7C7E7", borderRadius: "10px" }}>
          <VideoPlayer url={vid.fileUrl} />
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
              backgroundColor: "#A7C7E7",
            }}
          >
            {vid.currentRating > 0 ? (
              <StarRatingDisplay
                rating={vid.currentRating}
                fontSize="clamp(14px, 2.5vw, 28px)"
              />
            ) : (
              <span style={{ color: "#161823" }}>No ratings yet</span>
            )}
            {vid.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <strong style={{ color: "#161823" }}>Tags:</strong>
                {vid.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      backgroundColor: "#161823",
                      color: "#A7C7E7",
                      fontSize: "0.875rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {deleteError && (
                <p className="text-danger mb-0 w-100" role="alert">
                  {deleteError}
                </p>
              )}
              <Button
                variant="light"
                style={{
                  border: "2px solid #A7C7E7",
                  backgroundColor: "#161823",
                  color: "#A7C7E7",
                  flexShrink: 0,
                }}
                onClick={handleVideoLike}
              >
                {liked ? "Remove from likes" : "Add to likes"}
              </Button>
              {canManage && (
                <>
                  <Button
                    variant="light"
                    style={{
                      border: "2px solid #A7C7E7",
                      backgroundColor: "#161823",
                      color: "#A7C7E7",
                      flexShrink: 0,
                    }}
                    onClick={handleEditVideo}
                  >
                    Edit Video
                  </Button>
                  <Button
                    variant="light"
                    style={{
                      border: "2px solid #A7C7E7",
                      backgroundColor: "#161823",
                      color: "#A7C7E7",
                      flexShrink: 0,
                    }}
                    onClick={handleVideoDelete}
                  >
                    Delete Video
                  </Button>
                </>
              )}
            </div>
          </span>
        </Card>
        <br />
        <br />
        <Container>
          <Row>
            {!isOwner && (
              <div
                style={{
                  padding: "10px",
                  border: "2px solid #A7C7E7",
                  backgroundColor: "#A7C7E7",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                <h3 style={{ color: "#1f2532" }}>
                  <i>Rate this video</i>
                </h3>
                <Rating
                  videoId={vid._id}
                  currentRating={vid.currentRating}
                  currentRatingCount={vid.currentRatingCount}
                  contentRatings={vid.rating}
                  isVideo={true}
                  isAuthenticated={!!user}
                  isOwner={isOwner}
                  onRequireLogin={promptLogin}
                />
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
          </Row>
        </Container>
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
          {vid.reviews?.length > 0 ? (
            vid.reviews.map((rev, i) => (
              <div
                key={rev._id || i}
                style={{
                  padding: "10px",
                  backgroundColor: "#000000",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <ReviewComment review={rev} />
                {i < vid.reviews.length - 1 && (
                  <hr style={{ borderColor: "#A7C7E7", margin: "1% 0" }} />
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#A7C7E7", margin: 0 }}>No comments yet.</p>
          )}
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

export default Show;
