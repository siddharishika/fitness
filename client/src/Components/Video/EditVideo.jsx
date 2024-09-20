import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons';
import { IoAddOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

var file={};
var imgFile={};
// var arr=[];
var arr2=[];
function EditVideo() {
   let containerRef=useRef();
    let location=useLocation();
    let data=location.state;
    let fileRef=useRef();
    let imgFileRef=useRef();
    let tagRef=useRef();
    let navigate=useNavigate();

    let [vid , setVid]=useState({_id:"", name:"",fileId:"", fileUrl:""
    , filePath:"", imgFileId:"",imgFilePath:"",imgFileUrl:"" , tags:[],coach:{}});
    const params=useParams();
    let [arr,setArr]=useState([]);
    
    useEffect(function (){
        async function getVideo(){
            let res = await axios.get(`http://localhost:8080/show/${data}`  ,{withCredentials: true});
            // setVid(res.data.data);
            let {_id, name,fileId, fileUrl, filePath, imgFileId,imgFilePath,imgFileUrl , coach,tags}=res.data.data;
            let {username}=coach;
            setVid({_id,name,fileId, fileUrl, filePath, imgFileId,imgFilePath,imgFileUrl ,tags, coach})
            // arr=tags;
            setArr(tags);
            
        }
        getVideo();
    } , [params])
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
        let f=fileRef.current.value;
        let imgf=imgFileRef.current.value;
        let b1=arr==vid.tags;
        let b2=nameRef.current.value==vid.name;
        if(f || imgf || !b1 || !b2){
            try{
                let form=document.querySelector("form");
                
                
                let formData=new FormData(form);
                formData.append('tags' , arr);
                formData.append('id' , vid._id);
                // let x=formData.get('file');
                // formData.append("file",file);
                let info=Object.fromEntries(formData);
                if(f && imgf){
                    let res1=await axios.delete(`http://localhost:8080/delete/${vid._id}`,  {withCredentials: true});
                    let res=await axios.post(`http://localhost:8080/add/`, formData ,{withCredentials: true})
                    fn(res);
                }
                if(f && !imgf){
                    let res=await axios.patch(`http://localhost:8080/edit/f/${vid._id}`, formData ,{withCredentials: true})
                    fn(res);
                }
                if(imgf && !f){
                    let res=await axios.patch(`http://localhost:8080/edit/imgf/${vid._id}`, formData ,{withCredentials: true})
                    fn(res);
                }
                else if(!imgf && !f && (b1 || b2)){
                    let res=await axios.patch(`http://localhost:8080/edit/${vid._id}`, formData ,{withCredentials: true})
                    fn(res);
                }
                
            }catch(e){
                console.log(e,"Nahi ho payega")
            }  
        }else{
            console.log("Please edit first");
        }
        
    }
    const handlePlus=(e)=>{
        e.preventDefault();
        arr2=[...arr,tagRef.current.value]
        setArr(arr2);
        // arr=[...arr,tagRef.current.value]
        // let li=document.createElement('li');
        // let div=document.createElement('div')
        // let minus=document.createElement('div')
        // div.appendChild(li);
        // div.appendChild(minus);
        // minus.innerHTML="-"
        // let l=arr.length-1;
        // minus.id="child"+l;
        
        // li.innerHTML=tagRef.current.value;
        // div.id=arr.length-1;
        // containerRef.current.appendChild(div);
       
        
        // // minus.onClick=(e)=>handleMinus(e);
        // minus.setAttribute('onClick' , "handleMinus()");
    }
    const handleMinus=(e)=>{
        e.preventDefault();
        let array=[];
        arr.map((tag,index)=>{

            if(idx!=index){
                array.push(tag)
            }
        })
        // arr=array;
        setArr(array);
    }
    
    
    const handleFileChange=(e)=>{
        file=e.target.files[0];
        
      }
      const handleFileChange2=(e)=>{
        imgFile=e.target.files[0];
        
      }
    
  return (
    <div>
        <form  onSubmit={handleSubmit} encType="multipart/form-data" method='POST'>
        <label htmlFor="name">
            Video Title: 
        </label>
        <input ref={nameRef} defaultValue={vid.name} type="text" placeholder='Video Title' id='name' name="name" required/>
        <label htmlFor="tag"></label>
        <input type="text" ref={tagRef} />
        {/* <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
          
          <div className='plus' >
            <IoAddOutline id='plus' onClick={handlePlus} />
          </div>
         
        </IconContext.Provider> */}
        <div onClick={handlePlus}>+</div>
        <ul ref={containerRef} id='container'>
          {
            arr.map((tag,idx)=>{
                return (
                    // <div id={idx} >
                    <div key={idx}>
                        <li  >{tag}</li>
                        <div onClick={handleMinus}>-</div>
                    </div>
                    // {/* <div id={"child"+idx} onClick={handleMinus} >-</div> */}
                    // </div>
                )
            })
          }
          
        </ul>
        
        {/* <IKImage  onClick={showVideo}  p={vid._id} path={vid.imgFilePath} transformation={[{ height: 300, width: 400 }]} 
          loading="lazy" height="300" width="400" /> */}
          <b>If you want to change video, please select video</b>
          <br />
        <label htmlFor="file">Video File</label>
        <input name='file' type="file"  ref={fileRef}  onChange={handleFileChange} accept="video/*"/>
        <br />
        <b>If you want to change image, please select image</b>
        <br />
        <label htmlFor="imgFile">Image File</label>
        <input name='imgFile' type="file"  ref={imgFileRef} onChange={handleFileChange2} accept="image/*"/>
        <br />
        <button type="submit">Edit</button>
      </form>
    </div>
  )
}

export default EditVideo