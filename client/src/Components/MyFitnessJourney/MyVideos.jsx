import axios from 'axios';
 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function MyVideos() {
  let [vids, setVids] = useState([]);
  let navigate = useNavigate();
  useEffect(function () {
    async function getMyVideos() {
      let res = await axios.get(`${API_BASE_URL}/getall`, {
        withCredentials: true,
      });

      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      setVids(res.data.data);

      // setVideo(res.data.data);
      // setPrograms(res.data.data)
      // setData(res.data.data)
    }
    getMyVideos();
  }, []);
  const handleDelete = async (vid) => {
    try {
      let res = await axios.delete(`http://localhost:8080/delete/${vid._id}`, {
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
  const handleEdit = (vid) => {
    // let vidId=e.target.attributes[0].nodeValue;
    navigate("/edit", { state: vid._id });
  };
  const handleShowVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };
  return (
    <div>
      {vids && vids.map((vid, idx) => {
        return (
          <div key={idx}>
            <img src={vid.imgFileUrl} alt="" height="300" width="400" />
            <div>{vid.name}</div>
            <div>{vid.tags.join(" , ")}</div>
            <button onClick={(e) => handleShowVideo(vid)}>Show this</button>
            <button onClick={(e) => handleEdit(vid)}>Edit this</button>
            <button onClick={(e) => handleDelete(vid)}>Delete this</button>
          </div>
        );
      })}
    </div>
  );
}

export default MyVideos