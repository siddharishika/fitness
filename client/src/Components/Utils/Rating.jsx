import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AlreadyRatedModal, { isAlreadyRatedError } from "./AlreadyRatedModal";
import { isAuthRequiredError } from "./LoginRequiredModal";
import { isAuthorContentError } from "./authorContent";
import AuthorContentModal from "./AuthorContentModal";
import { useLoginPrompt } from "./useLoginPrompt";
import { useAuth } from "./AuthProvider";
import { getUserRatingEntry, hasUserRated } from "./ratingUtils";

export default function Rating(props) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { promptLogin, loginModal } = useLoginPrompt();
  const existingRating = getUserRatingEntry(props.contentRatings, user?._id);
  const [rating, setRating] = useState(existingRating?.userRating || 0);
  const [showAlreadyRated, setShowAlreadyRated] = useState(false);
  const [showAuthorContent, setShowAuthorContent] = useState(false);

  if (props.isOwner) {
    return null;
  }

  const changeRating = (newRating) => {
    if (existingRating) {
      setShowAlreadyRated(true);
      return;
    }
    setRating(newRating);
  };

  const handleAuthRequired = () => {
    if (props.onRequireLogin) {
      props.onRequireLogin();
      return;
    }
    promptLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.isOwner) {
      setShowAuthorContent(true);
      return;
    }
    if (props.isAuthenticated === false) {
      handleAuthRequired();
      return;
    }
    if (hasUserRated(props.contentRatings, user?._id)) {
      setShowAlreadyRated(true);
      return;
    }
    if (rating < 1) {
      return;
    }

    let total = props.currentRating * props.currentRatingCount + rating;
    let newCount = props.currentRatingCount + 1;
    let newAvg = total / newCount;

    if (props.isVideo) {
      let data = {
        userRating: rating,
        newRating: newAvg,
        newRatingCount: newCount,
      };
      try {
        let res = await axios.patch(`${API_BASE_URL}/addrating/${props.videoId}`, data, {
          withCredentials: true,
        });

        if (isAuthRequiredError(res)) {
          handleAuthRequired();
          return;
        }
        if (isAuthorContentError(res)) {
          setShowAuthorContent(true);
          return;
        }
        if (isAlreadyRatedError({ response: res })) {
          setShowAlreadyRated(true);
          return;
        }
        navigate("/");
      } catch (e) {
        if (isAlreadyRatedError(e)) {
          setShowAlreadyRated(true);
          return;
        }
        if (isAuthorContentError(e)) {
          setShowAuthorContent(true);
          return;
        }
        if (isAuthRequiredError(e)) {
          handleAuthRequired();
          return;
        }
      }
    }
  };

  if (existingRating) {
    return (
      <>
        <p style={{ color: "#1f2532", marginBottom: "8px" }}>
          You already rated this video ({existingRating.userRating} / 5).
        </p>
        <StarRatings
          rating={existingRating.userRating}
          starRatedColor="gold"
          numberOfStars={5}
          name="existing-rating"
          starDimension="40px"
          starSpacing="15px"
        />
        <AlreadyRatedModal
          show={showAlreadyRated}
          onHide={() => setShowAlreadyRated(false)}
          contentType="video"
        />
        {loginModal}
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <StarRatings
          rating={rating}
          starRatedColor="gold"
          changeRating={changeRating}
          numberOfStars={5}
          name="rating"
          starDimension="40px"
          starSpacing="15px"
        />
        <Button
          variant="light"
          style={{
            marginLeft: "20px",
            border: "2px solid black",
            paddingBottom: "1%",
            backgroundColor: "#161823",
            color: "#A7C7E7",
            borderRadius: "5px",
          }}
          type="submit"
        >
          Post Rating
        </Button>
      </form>
      <AlreadyRatedModal
        show={showAlreadyRated}
        onHide={() => setShowAlreadyRated(false)}
        contentType="video"
      />
      <AuthorContentModal
        show={showAuthorContent}
        onHide={() => setShowAuthorContent(false)}
      />
      {loginModal}
    </>
  );
}
