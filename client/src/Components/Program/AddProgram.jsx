import React, { createElement, useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons';
import { IoAddOutline } from 'react-icons/io5';

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

var info=[];
function AddProgram() {
    // let [arr,setArr]=useState([]);
    // let [equipment ,setEquipment]=useState([]);
    let equipment=[];
    let typeRef=useRef();
    let equipmentRef=useRef();
    let containerTypeRef=useRef();
    let nameRef=useRef();
    let arr=[]
    let equipmentRefContainer=useRef();
    let noOfDaysRef=useRef();
    const params=useParams();
    let [selectedValue , setSelect]=useState("PLease select an option");
    // let [arr,setArr]=useState([]);
    var [checked, setChecked]=useState([]);
    // let [vid , setVid]=useState({_id:"", name:"",fileId:"", fileUrl:""
    // , filePath:"", imgFileId:"",imgFilePath:"",imgFileUrl:"" , tags:[],coach:{}});
    let [vid, setVid]=useState([]);
    let timeRef=useRef();
    let descriptionRef=useRef();
    let navigate=useNavigate();
    // const params=useParams();
    function fn(res){
        if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
            

            navigate('/login');

        }
    }
    useEffect(function (){
        async function getVideo(){
            let res = await axios.get(`http://localhost:8080/getall`  ,{withCredentials: true});
            
            // setVid(res.data.data);
            
            fn(res);
            if(res.data.data){
                for(let i=0;i<res.data.data.length;i++){
                    let x=res.data.data[i];
                    // let {username}=coach;
                    // arr=tags;
                    let ax=[...vid, x];
                    setVid(ax);
                
                }
            }
            
            info=res.data.data;
        }
        getVideo();
    } , [params])

    const handlePlus1=(e)=>{
        e.preventDefault();
        arr=[...arr,typeRef.current.value]
        let li=document.createElement('li');
        li.innerHTML=typeRef.current.value;
        containerTypeRef.current.appendChild(li);

    }
    const handlePlus2=(e)=>{
        e.preventDefault();
        equipment=[...equipment,equipmentRef.current.value]
        let li=document.createElement('li');
        li.innerHTML=equipmentRef.current.value;
        equipmentRefContainer.current.appendChild(li);
       
    }

    const handleDays=(e)=>{
        let days=e.target.value;
        if(days<0){
            return;
        }
        let arr2=[];
        for(let i=0;i<vid.length;i++){
           arr2[i]=false;
        }

        let array=[];
        let dropDown=document.getElementById('dropdownButton');
        for(let i=0;i<dropDown.length;i++){
            dropDown.removeChild(dropDown[i]);
        }
        for(let i=0;i<days;i++){
            let naya=document.createElement('option');
            naya.innerHTML=i+1;
            naya.setAttribute('value', i+1);
            let dropDown=document.getElementById('dropdownButton');
            dropDown.appendChild(naya);

            array=[...array,arr2];

        }
       


        setChecked(array);
        setSelect(1);
   
    }
    const handleSelect=(e)=>{
        setSelect(e.target.value);
    }
    const handleChange=(e)=>{
        let x=e.target.attributes.i.value;
        let check=[];
        for(let i=0;i<checked.length;i++){
            check.push([]);
            for(let j=0;j<checked[i].length;j++){
                if(i==selectedValue-1 && j==x){
                    let dummy=checked[i][j];
                    check[i].push(!dummy)
                }else{
                    check[i].push(checked[i][j]);
                }
            }
        }
        setChecked(check);
        
        
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        let data={};
        data.name=nameRef.current.value;
        data.numberOfDays=noOfDaysRef.current.value;
        data.schedule=checked
        data.equipment=equipment;
        data.typeOfProgram=arr;
        data.description=descriptionRef.current.value;
        data.timePerDay=timeRef.current.value;
        try{
            let res=await axios.post("http://localhost:8080/addprogram", data ,{withCredentials: true})
            navigate('/allprograms')
            
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        }  
    }
    
  return (
    <form method='POST' onSubmit={handleSubmit}>
        <label htmlFor="name">Name of the Program</label>
        <input type="text" ref={nameRef} />
        <label htmlFor="noOfDays" >Number of Days</label>
        <input type="number" ref={noOfDaysRef} name='numberOfDays' onChange={handleDays} />
        <select id="dropdownButton" value={selectedValue} onChange={handleSelect}>
            
        </select>
        <br />
        <div>
            {vid.length>0 && checked.length>0 && 
                vid.map((ele,idx)=>{
                    return(
                        <div key={idx}>
                            <h1>{ele.name}</h1>
                            
                            <img src={ele.imgFileUrl} alt="" height="300" width="400"/>
                            <p>{checked[selectedValue-1]}</p>
                            {checked[selectedValue-1] &&
                                <input i={idx} type="checkbox" 
                                checked={checked.at(selectedValue-1).at(idx)} onChange={handleChange} />
                            }
                        </div>
                    )
                })
               
            }
            {/* <input type="checkbox"  
            // checked={checked}
            // onChange={handleChange}
            /> */}
        </div>
        <label htmlFor="type">Type</label>
        
        <input type="text" ref={typeRef} />
        
        <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
            
            <div className='plus' id='plus' >
                <IoAddOutline  
                onClick={handlePlus1} 
                />
            </div>
        
        </IconContext.Provider>
        <ul ref={containerTypeRef} id="typeOfWorkout" >
        
            
        </ul>
        <label htmlFor="equipment">Equipment</label>
        <input type="text" ref={equipmentRef} />
        <IconContext.Provider value={{ color: "black", className: "global-class-name" }}>
            
            <div className='plus' >
                <IoAddOutline  onClick={handlePlus2} />
            </div>
        
        </IconContext.Provider>
        <ul ref={equipmentRefContainer} >
        {
            
        }
        </ul>
        <label htmlFor="">timePerDay</label>
        <input type="number" ref={timeRef} />
        <label htmlFor="description">Description</label>
        <textarea name="descrition" ref={descriptionRef} id="" cols="30" rows="10"></textarea>
        <button type='submit' >Add Program</button>
    </form>
  )
}

export default AddProgram