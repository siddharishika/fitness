import axios from 'axios';
import React, { useRef, useState } from 'react'
import { IconContext } from 'react-icons';
import { IoAddOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';



var file={};
var imgFile={};
function UploadDemo() {
    let navigate=useNavigate();
    let fileRef=useRef();
    let tagRef=useRef();
    // let [arr,setArr]=useState([]);
    let arr=[];
    let data="";
    let tagsContainerRef=useRef();
    const handlePlus=(e)=>{
      e.preventDefault();
      arr=[...arr,tagRef.current.value]
      let li=document.createElement('li');
      li.innerHTML=tagRef.current.value;
      tagsContainerRef.current.appendChild(li);
    }
    const handleFileChange=(e)=>{
        file=e.target.files[0];
        
      }
      const handleFileChange2=(e)=>{
        imgFile=e.target.files[0];
        
      }
      
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            let form=document.querySelector("form");
            
            
            let formData=new FormData(form);
            formData.append('tags' , arr);
            // let x=formData.get('file');
            // formData.append("file",file);
            let info=Object.fromEntries(formData);
            var options = { content: formData };
            if(!info.imgFile.name || !info.file.name){
                console.log("Please add files first")
            }
            else{
                let res=await axios.post("http://localhost:8080/add", formData ,{withCredentials: true})
                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    navigate('/login')
                }if(res.data.success==false && res.data.message=="You need to be a coach to access this page!"){
                    navigate('/signup')
                }
            }
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        }  
    }
  return (
    <div>
        <form  onSubmit={handleSubmit} encType="multipart/form-data" method='POST' >
            
            <label htmlFor="name">Video Title:</label>
            <input type="text"  name='name'/>
            <label htmlFor="tag">Tag</label>
            <input type="text"  ref={tagRef} />
            
            <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
            
                <div className='plus' >
                    <IoAddOutline  onClick={handlePlus} />
                </div>
            
            </IconContext.Provider>
            <ul ref={tagsContainerRef} >
            {
                arr.map(function (ele,idx){
                return <li  key={idx}>{ele}</li>
                })
            }
            </ul>
            <label htmlFor="file">Video File</label>
            <input name='file' type="file" ref={fileRef} onChange={handleFileChange} accept="video/*"/>
            <label htmlFor="imgFile">Image File</label>
            <input name='imgFile' type="file" ref={fileRef} onChange={handleFileChange2} accept="image/*"/>
            <button>Uplaod file</button>
        </form>
    </div>
  )
}

export default UploadDemo