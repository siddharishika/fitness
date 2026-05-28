import axios from 'axios';
 
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { IoAddOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TagAdder from '../Utils/TagAdder';
import TagAdderEdit from '../Utils/TagAdderEdit';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
var file={};
var imgFile={};
// var arr=[];
var arr2=[];
function EditVideo(props) {
   let containerRef=useRef();
    let location=useLocation();
    let data=location.state;
    let fileRef=useRef();
    let imgFileRef=useRef();
    let tagRef=useRef();
    let navigate=useNavigate();
    let [tagsList, setTagsList] = useState({});
    let [selectedTags, setSelectedTags] = useState(data.tags || [] );
    let [selectedTagsChecked, setSelectedTagsChecked] = useState({});
    let [vid , setVid]=useState({_id:"", name:"",fileId:"", fileUrl:""
    , filePath:"", imgFileId:"",imgFilePath:"",imgFileUrl:"" , tags:[],coach:{}});
    const [tags, setVideoTags] = useState(props.tags);
      useEffect(() => {
      props.tags.forEach((tag) => {
        setSelectedTagsChecked((prev) => ({ ...prev, [tag]: data.tags.includes(tag) }));
      });
    }, [props.tags, selectedTags]);
    let x=vid.tags;
    let nameRef=useRef(vid.name);
    // setArr(x);
    let info={};
    function fn(res){
        if(res.data.success==false && res.data.message=="You are not author of this video"){
            navigate('/signup');
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        arr = [...arr, ...Object.keys(tagsList).filter((tag) => tagsList[tag])];
        let f=fileRef.current.value;
        let imgf=imgFileRef.current.value;
        let b1=arr==data.tags;
        let b2=nameRef.current.value==data.name;
        if(f || imgf || !b1 || !b2){
            try{
                let form=document.querySelector("form");
                let formData=new FormData(form);
                formData.append('tags' , arr.join(","));
                formData.append('id' , vid._id);
                // let x=formData.get('file');
                // formData.append("file",file);
                let info=Object.fromEntries(formData);
                if(f && imgf){
                    let res1 = await axios.delete(
                      `${API_BASE_URL}/delete/${vid._id}`,
                      { withCredentials: true }
                    );
                    let res = await axios.post(
                      `${API_BASE_URL}/add/`,
                      formData,
                      { withCredentials: true }
                    );
                    fn(res);
                }
                if(f && !imgf){
                    let res = await axios.patch(
                      `${API_BASE_URL}/edit/f/${vid._id}`,
                      formData,
                      { withCredentials: true }
                    );
                    fn(res);
                }
                if(imgf && !f){
                    let res = await axios.patch(
                      `${API_BASE_URL}/edit/imgf/${vid._id}`,
                      formData,
                      { withCredentials: true }
                    );
                    fn(res);
                }
                else if(!imgf && !f && (b1 || b2)){
                    let res = await axios.patch(
                      `${API_BASE_URL}/edit/${vid._id}`,
                      formData,
                      { withCredentials: true }
                    );
                    fn(res);
                }
                
            }catch(e){
                console.log(e,"Nahi ho payega")
            }  
        }else{
            console.log("Please edit first");
        }
        
    }

    const handleTagsChange = (tags) => {
    setSelectedTags(tags);
    console.log("Selected Tags:", tags);
  };
    const handleFileChange=(e)=>{
        file=e.target.files[0];
        
      }
      const handleFileChange2=(e)=>{
        imgFile=e.target.files[0];
        
      }
    
  return (
    <div>
      <div className='mx-auto'> 
            <Container className="p-4 border rounded">
            <Form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
            {/* <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST"> */}
              <div className="text-center mb-4">
                <h2>Edit your video here!</h2>
              </div>
              <Form.Group className="mb-3" controlId="formGridTitle">
                <Form.Label>Video Title</Form.Label>
                <Form.Control type="text" placeholder="Enter video title" name="name" ref={nameRef} defaultValue={data.name} required/>
              </Form.Group>
              <TagAdderEdit tags={tags} onTagsChange={handleTagsChange} selectedTagsChecked={selectedTagsChecked} />
              {/* <ul >
                {selectedTags && selectedTags.map(function (ele, idx) {
                  return <li key={idx}>{ele}</li>;
                })}
              </ul> */}
              {/* <TagAdder tags={tags} onTagsChange={handleTagsChange} /> */}
              {/* <ul ref={tagRef}>
                {arr && arr.map(function (ele, idx) {
                  return <li key={idx}>{ele}</li>;
                })}
              </ul> */}
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>If you want to change video, please select video</Form.Label>
                <Form.Control type="file" name='file'  ref={fileRef}  onChange={handleFileChange} accept="video/*" size="lg" />
              </Form.Group>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>If you want to change image, please select image</Form.Label>
                <Form.Control type="file" name='imgFile' ref={imgFileRef} onChange={handleFileChange2} accept="image/*" size="lg" />
              </Form.Group>
              <Button variant="primary" type="submit" className='w-100'>
              Submit
              </Button>
              {/* <button type="submit">Submit</button> */}
            {/* </form> */}
            </Form>
            </Container>
          </div>
    </div>
  )
}

export default EditVideo