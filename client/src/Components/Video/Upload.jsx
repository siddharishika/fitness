import React, { useState } from 'react'
import { IconContext } from "react-icons";

import { IoAddOutline } from "react-icons/io5";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from '../../store/thunks/admin';
import { IKUpload } from 'imagekitio-react';
import axios from 'axios';

// var fileId="";
// var filePath="";
// var fileUrl="";

function Upload() {
    const navigate=useNavigate();
    let [file, setFile] = useState();
    // let [name, setName]=useState("");
    // const [source, setSource] = React.useState();
    let fileRef=useRef();
    let nameRef = useRef("");
    let tagRef = useRef("");
    var [fileId,setFileId]=useState();
    var [filePath,setFilePath]=useState();
    var [fileUrl,setFileUrl]=useState();
    var [ImgFileId,setImgFileId]=useState();
    var [ImgFilePath,setImgFilePath]=useState();
    var [ImgFileUrl,setImgFileUrl]=useState();
  var [flag,setFlag]=useState(false);
  var [flag2,setFlag2]=useState(false);
    let [arr,setArr]=useState([]);

    

    const handlePlus=(e)=>{
      e.preventDefault();
      let arr1=[...arr,tagRef.current.value]
      setArr(arr1);
      
    }

    // let [fileId,setFileId]=useState("");
    let formData={};
    function fn(fileId, filePath, fileUrl){
      // formData.fileId=fileId;
      
      // formData.filePath=filePath;
      // formData.fileUrl=fileUrl;
    }
    const onSuccess = (res) => {
      console.log('Success');
      // fileId=res.fileId;
      setFileId(res.fileId)
      setFilePath(res.filePath);
      setFileUrl(res.url);
      // // fileId=res;
      // // filePath=res.filePath;
      // // fileUrl=res.url;
      // fn(fileId, filePath, fileUrl);
      // fn(fileId);
      // setFileId(res.fileId);
      setFlag(true);
      return res;
      
    };
    const onSuccess2=(res)=>{
      
      setImgFileId(res.fileId);
      setImgFilePath(res.filePath);
      setImgFileUrl(res.url);
      setFlag2(true);
    }
    
    let handleSubmit = async function(e)  {
        e.preventDefault();
        
        // formData.id=id.id;
        // let formData={};
        formData.name= nameRef.current.value;
        formData.tags=arr;
        formData.fileId=fileId;
        formData.filePath=filePath;
        formData.fileUrl=fileUrl;
        formData.imgFileId=ImgFileId;
        formData.imgFilePath=ImgFilePath;
        formData.imgFileUrl=ImgFileUrl;
        
        // formData.fileId=fileId;
      if(flag){
        try{

          let res=await axios.post("http://localhost:8080/addvideo",  {formData},{withCredentials: true});
          navigate("/");
          }catch(e){
              console.log(e,"Nahi ho payega")
          }
      }else{
        console.log("Please wait");
      }
    };
    
    
  
    return (
     <>
       <form  onSubmit={handleSubmit} encType="multipart/form-data" >
        
        
        <label htmlFor="name">
            Video Title: 
        </label>
        <input ref={nameRef} type="text" placeholder='Video Title' id='name' name="name" required/>
       
        
        {/* <div>
            <label htmlFor="img">Img</label>
            <input type="file" name="img" id="img" placeholder="Img" />
        </div>     */}
        <label htmlFor="fitnessVideo"></label>
        <label htmlFor="Video">Video:</label>
        <IKUpload placeholder='Video' onSuccess={onSuccess} fileName={name} folder={"/fitness"} useUniqueFileName={false} isPrivateFile= {false}  required/> 

        
        <label htmlFor="Image">Image:</label>
        {/* <input type="file" ref={fileRef} onChange={handleFileChange}/> */}
        <IKUpload
          fileName={name+"img"}
          // onError={onError}
          placeholder='Image'
          folder={"/fitnessImages"}
          onSuccess={onSuccess2}
        />
        <input type="text" ref={tagRef}/>
        <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
          
          <div className='plus' >
            <IoAddOutline  onClick={handlePlus} />
          </div>
         
        </IconContext.Provider>
        <ul>
          {
            arr.map(function (ele,idx){
              return <li key={idx}>{ele}</li>
            })
          }
        </ul>
       {/* <input type='text' /> */}
      {/* {<button onClick={handleFileChange}>Choose</button>} */}
      {/* {  
        check()
      } */}
      {/* {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height="20%"
          controls
          src={source}
        />
      )} */}
        <button type="submit">Upload File</button>
      </form>
     </>
    );
  
}

export default Upload