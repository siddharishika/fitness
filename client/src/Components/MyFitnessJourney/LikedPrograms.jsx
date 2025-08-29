import axios from "axios";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function LikedVideos() {
  let [data, setData] = useState({});
  let navigate = useNavigate();
  useEffect(function () {
    async function getLikedVideos() {
      let res = await axios.get(`${API_BASE_URL}/getlikedprograms`, {
        withCredentials: true,
      });
      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      setData(res.data.data);
    }
    getLikedVideos();
  }, []);
  // const handleShow=(vid)=>{
  //     navigate('/show', {state:vid})
  // }
  const handleShowProgram = (program) => {
    navigate("/showprogram", { state: program });
  };
  return (
    <div>
      <h1>My Liked Videos</h1>
      {data.likedPrograms &&
        data.likedPrograms.map((program, idx) => {
          return (
            <div onClick={(e) => handleShowProgram(program)}>
              <h3>{program.name}</h3>
              <h3>{"Number of days" + program.numberOfDays}</h3>
              <h3>{"Equipements: " + program.equipment.join(" , ")}</h3>
              <h5>
                Rating: {program.rating == 0 && <div>No Ratings Yet</div>}
                {program.rating > 0 && <div>{program.rating}</div>}
              </h5>
            </div>
          );
        })}
    </div>
  );
}

export default LikedVideos;
