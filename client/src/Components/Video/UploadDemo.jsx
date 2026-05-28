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


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
var file = {};
var imgFile = {};
function UploadDemo(props) {
  let navigate = useNavigate();
  let fileRef = useRef();
  let tagRef = useRef();
  // let [arr,setArr]=useState([]);
  let arr = [];
  let data = "";
  let tagsContainerRef = useRef();
  // tags=tags.tags || [];
  let [tagsList, setTagsList] = useState({});
  const [tags, setVideoTags] = useState(props.tags); 
  const [selectedTags, setSelectedTags] = useState([]);


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
    try {
      let form = document.querySelector("form");

      arr = [...arr, ...Object.keys(tagsList).filter((tag) => tagsList[tag])];
      let formData = new FormData(form);
      formData.append("tags", selectedTags.join(","));
      // let x=formData.get('file');
      // formData.append("file",file);
      let info = Object.fromEntries(formData);
      var options = { content: formData };
      if (!info.imgFile.name || !info.file.name) {
        console.log("Please add files first");
      } else {
        let res = await axios.post(`${API_BASE_URL}/add`, formData, {
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
        if (
          res.data.success == false &&
          res.data.message == "You need to be a coach to access this page!"
        ) {
          navigate("/signup");
          return;
        }
        // Navigate to home after successful upload
        navigate("/");
      }
    } catch (e) {
      console.log(e, "Nahi ho payega");
      navigate("/");
    }
  };
  return (
    <div className='mx-auto'> 
      <Container className="p-4 border rounded">
      <Form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
      {/* <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST"> */}
        <div className="text-center mb-4">
          <h2>Upload Video</h2>
          <p>Upload your first video as a coach!</p>
        </div>
        <Form.Group className="mb-3" controlId="formGridTitle">
          <Form.Label>Video Title</Form.Label>
          <Form.Control type="text" placeholder="Enter video title" name="name" />
        </Form.Group>
        
        <TagAdder tags={tags} onTagsChange={handleTagsChange}  />
        <ul ref={tagsContainerRef}>
          {arr && arr.map(function (ele, idx) {
            return <li key={idx}>{ele}</li>;
          })}
        </ul>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Video File</Form.Label>
          <Form.Control type="file" name='file' ref={fileRef} onChange={handleFileChange} size="lg" />
        </Form.Group>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Image File</Form.Label>
          <Form.Control type="file" name='imgFile' ref={fileRef} onChange={handleFileChange2} size="lg" />
        </Form.Group>

        <Button variant="primary" type="submit" className='w-100'>
        Submit
        </Button>
        {/* <button type="submit">Submit</button> */}
      {/* </form> */}
      </Form>
      </Container>
    </div>
  );
}

export default UploadDemo