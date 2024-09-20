import axios from 'axios';
import { IKImage, IKVideo } from 'imagekitio-react';
import React, { useEffect, useRef, useState } from 'react'
import Show from './Show';
import { Link, useNavigate } from 'react-router-dom';
// import {useHistory} from 'react-router-dom';
function AllVideos() {
  let navigate=useNavigate();

  let imgRef=useRef("");
  
  let [fitnessVideo, setVideo] = useState([]);
  // const history = useHistory();
  useEffect(function (){
      async function getVideo(){
          let res = await axios.get("http://localhost:8080/allvideos" ,{withCredentials: true});
          setVideo(res.data.data);

      }
      getVideo();
  } , [])

  // let x=fitnessVideo[0];
  // fitnessVideo.map((vid,idx)=>{
  // })
  const showVideo=(ele)=>{
    // let p=e.target.attributes[0].nodeValue;

    // console.log("This is p", p);
    navigate(`/show` , {state:ele});
  }
  
  
  return (
    <div>
      {/* {
       
          x && <video src={x.url} width="100%"
          height="20%"
          controls />
        
      } */}
      {
      fitnessVideo.map(function(vid,idx){
        
        return <div  key={idx}>
          {/* <video onClick={showVideo} key={idx} src={vid.fileUrl} width="30%" height="20%" controls /> */}
          {/* <IKImage  onClick={showVideo} key={idx} p={vid._id} path={vid.imgFilePath} transformation={[{ height: 300, width: 400 }]} 
          loading="lazy" height="300" width="400" /> */}
          <img onClick={(e)=>showVideo(vid)}  ref={imgRef} key={idx} p={vid._id} src={vid.imgFileUrl} alt="" height="300" width="400"/>
          <br />
          <i  >{vid.name}</i>
          <br />
          <i >Coach: {vid.coach && vid.coach.username}</i>
          <br />
          Rating: {
              vid.rating==0 && <div>No ratings yet</div>
            }
            {
              vid.rating>0 && <div>{vid.rating}</div>
            }
          <br />
          {/* <h6  vid_id={vid._id} onClick={handleDelete} >Delete</h6> */}
          {/* <h6 vid_id={vid._id} onClick={handleEdit} >Edit</h6> */}
        </div>
          
        // return <div key={idx} >
        // <IKVideo  key={idx}
        // path={vid.filePath}
        // transformation={[{ "width": "30vw", "height": "30vh" }]}
        // // controls={true}
        // />
        // </div>
          //  return <IKVideo urlEndpoint={urlEndpoint} path={vid.filePath} key={idx}
          // // src={vid.url}
          // transformation={[{ height: "20%", width: 600, b: '5_red', q: 95 }]}
          // controls={true}/>
          
        
      // <video src={vid.url}></video>
      })
      }
      
    </div>
  )
}

export default AllVideos