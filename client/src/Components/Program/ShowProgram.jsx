import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function ShowProgram() {
    let location=useLocation();
    let program=location.state;
    let [selectedValue, setSelect]=useState(1);
    const params=useParams();
    let [arr,setArr]=useState([]);
    // let [program, setProgram]=useState();
    let [vids, setVids]=useState([]);
    let [show, setShow]=useState([]);
    let navigate=useNavigate();
    useEffect(function (){
        async function getProgram(){
            let res = await axios.get(`http://localhost:8080/showprogram/${program._id}`  ,{withCredentials: true});
            let { vids}=res.data.data;
            
            // setProgram(program);
            setVids(vids);
            setSelect(1);
            let dropdown=document.getElementById('dropdownButton');
            dropdown.setAttribute('value', selectedValue);
            setShow(vids[0])
            
        }
        getProgram();
    } , [params])
    
    
    const handleSelect=(e)=>{
        setSelect(e.target.value);
        let dropdown=document.getElementById('dropdownButton');
        dropdown.setAttribute('value', selectedValue);
        fn(selectedValue);
    }
    function fn(val){
        setShow(vids[val]);
    }
    const handleShow=(id)=>{
        navigate(`/show` , {state:id});
    }
    const handleLikedPrograms=async()=>{
        let data={};
        data.program=program;
        data.vids=vids;
        try{
            let res=await axios.post("http://localhost:8080/changeprogramlike", data ,{withCredentials: true})

                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
                    navigate('/login');
                    return;
                }
                navigate('/')
            
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        } 
    }
  return (
    <div>ShowProgram
        <h1>{program.name}</h1>
        <h5>Rating: {
                            program.rating==0 && <div>No Ratings Yet</div>
                            }
                            {
                                program.rating>0 && <div>{program.rating}</div>
                            }</h5>
        <select id="dropdownButton" onChange={handleSelect} >
            {program && 
                program.schedule.map((day,idx)=>{
                    return(
                        <option value={idx+1} key={idx}>Day {idx+1}</option>
                    )
                })
            }
         </select>
            { show && 
                show.map((ele,idx)=>{
                    return(
                        <div key={idx} onClick={(e)=>handleShow(ele._id)}>
                            <h1>Day {idx+1}</h1>
                            <h3>{ele.name}</h3>
                            <img src={ele.imgFileUrl} alt="" height="150" width="150"/>
                            <h3>{ele.tags.join(" , ")}</h3>
                        </div>
                    )
                })

            }
            {!show  && <div>Rest Day</div>
            }
        <button onClick={handleLikedPrograms}>Add to Liked Programs</button>
    </div>
  )
}

export default ShowProgram