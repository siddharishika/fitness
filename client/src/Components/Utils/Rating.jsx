import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Rating(props) {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const navigate = useNavigate();
  //   const [rating, setRating] = useState(3.5); // initial rating
  const [rating, setRating] = useState(props.currentRating || 0); // initial rating
  const changeRating = (newRating) => {
    setRating(newRating);
    };
    const videoId = props.videoId;
  console.log("rating ", rating);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let total = props.currentRating * props.currentRatingCount + rating;
    let newCount = props.currentRatingCount + 1;
    let newAvg = total / newCount;
      console.log("New Average Rating: ", newAvg);
    
      if (props.isVideo) {
          let data = {
              userRating: rating,
              newRating: newAvg,
              newRatingCount: newCount,
          };
          console.log("Data to be sent: ", data);
      try {
        let res = await axios.patch(`${API_BASE_URL}/addrating/${props.videoId}`, data, {
          withCredentials: true,
        });

        if (
          res.data.success == false &&
          res.data.message ==
            "You need to be authenticated to access this page!"
        ) {
          navigate("/login");
          return;
        }
        navigate("/");
      } catch (e) {
        console.log(e, "Nahi ho payega");
      }
    }
  };
  return (
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
      <button type="submit">Post Rating</button>
    </form>
  );
}
