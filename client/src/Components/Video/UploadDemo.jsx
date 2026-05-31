import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TagAdder from "../Utils/TagAdder";
import { useLoginPrompt } from "../Utils/useLoginPrompt";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
var file = {};
var imgFile = {};
function UploadDemo(props) {
  let navigate = useNavigate();
  const { loginModal, handleAuthResponse } = useLoginPrompt();
  let fileRef = useRef();
  let imgFileRef = useRef();
  let tagRef = useRef();
  // let [arr,setArr]=useState([]);
  let arr = [];
  let data = "";
  let tagsContainerRef = useRef();
  // tags=tags.tags || [];
  let [tagsList, setTagsList] = useState({});
  const [tags, setVideoTags] = useState(props.tags); 
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const handlePlus = (e) => {
    e.preventDefault();
    arr = [...arr, tagRef.current.value];
    let li = document.createElement("li");
    li.innerHTML = tagRef.current.value;
    tagsContainerRef.current.appendChild(li);
  };
  const handleFileChange = (e) => {
    file = e.target.files[0];
  };
  const handleFileChange2 = (e) => {
    imgFile = e.target.files[0];
  };
  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
    console.log("Selected Tags:", tags);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const videoFile = formData.get("file");
    const imageFile = formData.get("imgFile");

    if (!name) {
      setError("Please enter a video title.");
      return;
    }
    if (!videoFile?.name) {
      setError("Please select a workout video file.");
      return;
    }
    if (!imageFile?.name) {
      setError("Please select a thumbnail photo.");
      return;
    }

    formData.set("tags", selectedTags.join(","));

    setSubmitting(true);
    try {
      let res = await axios.post(`${API_BASE_URL}/add`, formData, {
        withCredentials: true,
      });
      if (handleAuthResponse(res)) {
        return;
      }
      if (
        res.data.success == false &&
        res.data.message == "You need to be a coach to access this page!"
      ) {
        navigate("/signup");
        return;
      }
      navigate("/");
    } catch (err) {
      if (handleAuthResponse(err)) {
        return;
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Could not upload video. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
    <div className='mx-auto'> 
      <Container className="p-4 border rounded">
      <Form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
      {/* <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST"> */}
        <div className="text-center mb-4">
          <h2 style={{ color: "#A7C7E7" }}>Upload Video</h2>
          <p style={{ color: "#A7C7E7" }}>Upload your workout video and a thumbnail photo.</p>
        </div>

        {error && (
          <p className="text-danger" role="alert">
            {error}
          </p>
        )}

        <Form.Group className="mb-3" controlId="formGridTitle">
          <Form.Label>Video Title</Form.Label>
          <Form.Control type="text" placeholder="Enter video title" name="name" required />
        </Form.Group>
        
        <TagAdder tags={tags} onTagsChange={handleTagsChange}  />
        <ul ref={tagsContainerRef}>
          {arr && arr.map(function (ele, idx) {
            return <li key={idx}>{ele}</li>;
          })}
        </ul>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Video File <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="file"
            name="file"
            ref={fileRef}
            onChange={handleFileChange}
            accept="video/*"
            size="lg"
            required
          />
        </Form.Group>
        <Form.Group controlId="formFileImg" className="mb-3">
          <Form.Label>Thumbnail Photo <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="file"
            name="imgFile"
            ref={imgFileRef}
            onChange={handleFileChange2}
            accept="image/*"
            size="lg"
            required
          />
        </Form.Group>

        <Button
          variant="light"
          type="submit"
          className="w-100"
          disabled={submitting}
          style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823", color: "#A7C7E7" }}
        >
          {submitting ? "Uploading…" : "Submit"}
        </Button>
        {/* <button type="submit">Submit</button> */}
      {/* </form> */}
      </Form>
      </Container>
    </div>
    {loginModal}
    </>
  );
}

export default UploadDemo