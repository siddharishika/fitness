import React, { createElement, useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons';
import { IoAddOutline } from 'react-icons/io5';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

var info=[];
function EditProgram() {
    // let [arr,setArr]=useState([]);
    // let [equipment ,setEquipment]=useState([]);
    let location=useLocation();
    let data=location.state;
    let equipment=[];
    let typeRef=useRef();
    let equipmentRef=useRef();
    let containerTypeRef=useRef();
    let nameRef=useRef();
    let arr=[]
    let equipmentRefContainer=useRef();
    let noOfDaysRef=useRef();
    const params=useParams();
    let [selectedValue , setSelect]=useState(1);
    // let [arr,setArr]=useState([]);
    var [checked, setChecked]=useState(data.schedule);
    // let [vid , setVid]=useState({_id:"", name:"",fileId:"", fileUrl:""
    // , filePath:"", imgFileId:"",imgFilePath:"",imgFileUrl:"" , tags:[],coach:{}});
    let [vid, setVid]=useState([]);
    let [vid2, setVid2]=useState({});
    let timeRef=useRef();
    let descriptionRef=useRef();
    let navigate=useNavigate();
    let [typeArr,setTypeArr]=useState(data.typeOfProgram);
    let [equipArr, setEquipArr]=useState(data.equipment);
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
            let ax2={};
            let ax=[];
            if(res.data.data){
                for(let i=0;i<res.data.data.length;i++){
                    let x=res.data.data[i];
                    // let {username}=coach;
                    // arr=tags;
                    
                    ax2={...ax2};
                    ax2[x._id]=x;
                    ax=[...ax];
                    ax[i]=x;
                
                }
                setVid(ax);
                setVid2(ax2);
                let arr=[];
                let max=0;
                for(let check=0;check<data.schedule.length;check++){
                    if(max<data.schedule[check].length){
                        max=data.schedule[check].length;
                    }
                    
                    
                }
                for(let day=0;day<data.schedule.length;day++){
                    arr.push([]);
                    for(let j=0;j<max;j++){
                        if(data.schedule[day][j]){
                            arr[day].push(true);
                        }else{
                            arr[day].push(false);
                        }
                    }
                }
                setChecked(arr);
                // setChecked(data.schedule);
                setSelect(1);
               
            }
        }
        getVideo();
    } , [params])

    const handlePlus1=(e)=>{
        e.preventDefault();
        let arr=[...typeArr];
        arr.push(typeRef.current.value);
        setTypeArr(arr);
        // arr=[...arr,typeRef.current.value]
        // let li=document.createElement('li');
        // li.innerHTML=typeRef.current.value;
        // containerTypeRef.current.appendChild(li);

    }
    const handlePlus2=(e)=>{
        e.preventDefault();
        let arr=[...equipArr];
        arr.push(equipmentRef.current.value);
        setEquipArr(arr);
        // equipment=[...equipment,equipmentRef.current.value]
        // let li=document.createElement('li');
        // li.innerHTML=equipmentRef.current.value;
        // equipmentRefContainer.current.appendChild(li);
       
    }
    const handleMinus1=(idx)=>{
        let arr=[];
        for(let i=0;i<idx;i++){
            if(i!=idx){
                arr.push(typeArr[i]);
            }
        }
        setTypeArr(arr);
    }
    const handleMinus2=(idx)=>{
        let arr=[];
        for(let i=0;i<idx;i++){
            if(i!=idx){
                arr.push(typeArr[i]);
            }
        }
        setEquipArr(arr);
    }
    const handleDays=(e)=>{
        let days=e.target.value;
        let array=[];
        if(days<0){
            return;
        }
        if(days>checked.length){
            let arr2=[];
            for(let i=0;i<vid.length;i++){
                arr2[i]=false;
            }
            array=[...checked];
            // let dropDown=document.getElementById('dropdownButton');
            // for(let i=0;i<dropDown.length;i++){
            //     dropDown.removeChild(dropDown[i]);
            // }
            for(let i=checked.length;i<days;i++){
                // let naya=document.createElement('option');
                // naya.innerHTML=i+1;
                // naya.setAttribute('value', i+1);
                // let dropDown=document.getElementById('dropdownButton');
                // dropDown.appendChild(naya);
                array=[...array,arr2];
                

            }
       
        }else if(days<checked.length){
            
            // let dropDown=document.getElementById('dropdownButton');
            // for(let i=0;i<dropDown.length;i++){
            //     dropDown.removeChild(dropDown[i]);
            // }
            for(let i=0;i<days;i++){
                // let naya=document.createElement('option');
                // naya.innerHTML=i+1;
                // naya.setAttribute('value', i+1);
                // let dropDown=document.getElementById('dropdownButton');
                // dropDown.appendChild(naya);
                array.push(checked[i]);
                

            }
       
        }else{
            
            return;
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
        let data2={};
        data2.id=data._id;
        data2.name=nameRef.current.value;
        data2.numberOfDays=noOfDaysRef.current.value;
        data2.schedule=checked
        data2.equipment=equipArr;
        data2.typeOfProgram=typeArr;
        data2.description=descriptionRef.current.value;
        data2.timePerDay=timeRef.current.value;
        try{
            let res=await axios.patch("http://localhost:8080/editprogram", data2 ,{withCredentials: true})
            fn(res);
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        }  
    }
    
  return (
    <form method='POST' onSubmit={handleSubmit}>
        <label htmlFor="name">Name of the Program</label>
        <input type="text" ref={nameRef}  defaultValue={data.name} />
        <label htmlFor="noOfDays" >Number of Days</label>
        <input type="number" ref={noOfDaysRef} name='numberOfDays' defaultValue={data.numberOfDays} onChange={handleDays} />
        <select id="dropdownButton" value={selectedValue} onChange={handleSelect}>
            {
                checked && checked.map((ele,idx)=>{
                    return (
                        
                            <option key={idx} value={idx+1}>{idx+1}</option>
                        
                    )
                })
            }     
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
            {
                typeArr.map((ele,idx)=>{
                    return(
                        <li key={idx}>
                            <h5>{ele}</h5>
                            <h5 onClick={(e)=>handleMinus1(idx)}>-</h5>
                        </li>
                    )
                })
            }
            
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
            equipArr.map((ele,idx)=>{
                return(
                    <li key={idx}>
                        <h5>{ele}</h5>
                        <h5 onClick={(e)=>handleMinus2(idx)}>-</h5>
                    </li>
                )
            })
        }
        </ul>
        <label htmlFor="">timePerDay</label>
        <input type="number" defaultValue={data.timePerDay} ref={timeRef} />
        <label htmlFor="description">Description</label>
        <textarea name="descrition" ref={descriptionRef} defaultValue={data.description} id="" cols="30" rows="10"></textarea>
        <button type='submit' >Edit Program</button>
    </form>
  )
}

export default EditProgram