import axios from 'axios';
 
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RatingPrograms from "./RatingPrograms";
import { useAuth } from '../Utils/AuthProvider';
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || window.location.origin;
  
function ShowProgram() {
  let location = useLocation();
  let program = location.state;
  let [selectedValue, setSelect] = useState(1);
  const params = useParams();
  let [arr, setArr] = useState([]);
  let [vids, setVids] = useState([]);
  let [show, setShow] = useState([]);
  let navigate = useNavigate();
  let { user } = useAuth();
  const reviewRef = useRef(null);
  console.log(user);
  const coachId = program?.coach?._id ?? program?.coach;
  const isOwner = user && coachId && String(user._id) === String(coachId);
  
  useEffect(
    function () {
      async function getProgram() {
        let res = await axios.get(
          `${API_BASE_URL}/showprogram/${program._id}`,
          { withCredentials: true }
        );
        let { vids} = res.data.data;
        // setProgram(program);
        setVids(vids);
        setSelect(1);
        let dropdown = document.getElementById("dropdownButton");
        dropdown.setAttribute("value", selectedValue);
        setShow(vids[0]);
      }
      getProgram();
    },
    [params]
  );
  
  const handleSelect = (e) => {
    setSelect(e.target.value);
    let dropdown = document.getElementById("dropdownButton");
    dropdown.setAttribute("value", selectedValue);
    fn(selectedValue);
  };
  function fn(val) {
    setShow(vids[val]);
  }
  const handleShow = (ele) => {
    navigate(`/show`, { state: ele });
  };
  const handleEditProgram = () => {
    navigate(`/program/edit`, { state: program });
  };
  const handleLikedPrograms = async () => {
    let data = {};
    data.program = program;
    data.vids = vids;
    try {
      let res = await axios.post(`${API_BASE_URL}/changeprogramlike`, data, {
        withCredentials: true,
      });

      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };
  const handleDeleteProgram = async (e) => {
    try {
      let res = await axios.post(`${API_BASE_URL}/deleteprogram/${program._id}`, program, {
        withCredentials: true,
      });
      if ( res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!") {
        navigate("/login");
        return;
      }    
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    } 
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewText = reviewRef.current ? reviewRef.current.value : "";
    console.log("Submitting review:", reviewText);
    let data = {};
    data.review = reviewText;
    try {
      let res = await axios.post(`${API_BASE_URL}/program/addreview/${program._id}`, data, {
      withCredentials: true,
    });
    if (
    res.data.success == false &&
    res.data.message == "You need to be authenticated to access this page!"
    ) {
      navigate("/login");
      return;
    }
    navigate("/showprogram", { state: program });
    reviewRef.current.value = "";
    }catch (e) {
      console.log(e, "Nahi ho payega"); 
    }
  }

  if (!program) {
    return <div>Loading program...</div>;
  }
  console.log(program);
  return (
    <div>
      ShowProgram
      <h1>{program.name}</h1>
      
      {!isOwner &&
      <>
        <RatingPrograms programId={program._id} currentRating={program.currentRating} currentRatingCount={program.currentRatingCount} isProgram={true} />
        <br />
        <br />
        <form onSubmit={handleReviewSubmit}  method="POST">
          <label htmlFor="review">Review</label>
          <textarea
            ref={reviewRef}
            name="review"
            id="review"
            placeholder="Enter your review here"
            cols="30"
            rows="10"
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </>
      }
      <select id="dropdownButton" onChange={handleSelect}>
        {program?.schedule?.map((day, idx) => {
            return (
              <option value={idx + 1} key={idx}>
                Day {idx + 1}
              </option>
            );
          })}
      </select>
      {show &&
        show.map((ele, idx) => {
          return (
            <div key={idx} onClick={(e) => handleShow(ele)}>
              <h1>Day {idx + 1}</h1>
              <h3>{ele.name}</h3>
              <img src={ele.imgFileUrl} alt="" height="150" width="150" />
              <h3>{ele.tags.join(" , ")}</h3>
            </div>
          );
        })}
      {!show && <div>Rest Day</div>}
      {isOwner && (
        <>
          <button onClick={handleEditProgram}>Edit Program</button>
          <button onClick={handleDeleteProgram}>Delete Program</button>
        </>
      )}
      <button onClick={handleLikedPrograms}>Add to Liked Programs</button>
      <>
      {program && program.reviews && program.reviews.map((rev, i) => {
        return (
          <div key={i}>
            <h4>{rev.user.username}</h4>
            <p>{rev.review}</p>
          </div>
        );
      })}
      </>
    </div>
  );
}

export default ShowProgram