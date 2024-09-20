import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
    let [ingredients, setIngredients]=useState([]);
    let [process , setProcess]=useState([]);
    let ingredientRef=useRef();
    let amountRef=useRef();
    let processRef=useRef();
    let [tags, setTags]=useState([]);
    let tagRef=useRef();
    let timeRequiredRef=useRef();
    let nameRef=useRef();
    let descriptionRef=useRef();
    let photoRef=useRef();
    let navigate=useNavigate();
    function fn(res){
        
    }
    const handleIngredients=(e)=>{
        let arr=[...ingredients];
        let obj={};
        obj.ingredient=ingredientRef.current.value;
        obj.amount=0;
        arr.push(obj);
        setIngredients(arr);
    }
    const handleAmount=(idx)=>{
        let arr=[];
        let amount=document.getElementById("amount"+idx);
        for(let i=0;i<ingredients.length;i++){
            if(i==idx){
                let obj={};
                obj.ingredient=ingredients[i].ingredient;
                obj.amount=amount.value;
                arr.push(obj);
            }else{
                arr.push(ingredients[i]);
            }
        }
        setIngredients(arr);
    }
    const handleProcess=(e)=>{
        let arr=[...process];
        arr.push(processRef.current.value);
        setProcess(arr);
    }
    const handleTag=(e)=>{
        let arr=[...tags];
        arr.push(tagRef.current.value);
        setTags(arr);
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        let data={};
        data.timeRequired=timeRequiredRef.current.value;
        data.process=process;
        data.tags=tags;
        data.ingredients=ingredients;
        data.name=nameRef.current.value;
        data.description=descriptionRef.current.value;
        data.photo=photoRef.current.value;
        try{
            let res=await axios.post("http://localhost:8080/addrecipe", data ,{withCredentials: true})
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
    <form method='POST'>AddRecipe
        <label htmlFor="name">Name of Recipe</label>
        <input type="text" ref={nameRef}/>
        <br />
        <label htmlFor="Ingredients">Ingredient</label>
        <input type="text" ref={ingredientRef} />
        <div onClick={handleIngredients} >+</div>
        <br />
        <ul>
            {
                ingredients.map((ele,idx)=>{
                    return(
                        <li key={idx}>
                            <div>{ele.ingredient}</div>
                            <label htmlFor="amount">Amont of ingredient in grams</label>
                            <input type="text" name="" id={"amount"+idx}  />
                            <div  onClick={(e)=>handleAmount(idx)} >+</div>
                            <div>{ele.amount}</div>
                        </li>
                    )
                })
            }
        </ul>
        <br />
        <label htmlFor="description">Description of the Recipe</label>
        <textarea name="description" id="" cols="30" rows="10" ref={descriptionRef}></textarea>
        <br />
        <label htmlFor="process">Process</label>
        <textarea name="process" id="" cols="30" rows="10" ref={processRef}></textarea>
        <div onClick={handleProcess}>+</div>
        <br />
        <ul>
            {
                process.map((ele,idx)=>{
                    return(
                        <li key={idx}>
                            {ele}
                        </li>
                    )
                })
            }
        </ul>
        <br />
        <label htmlFor="tags">Tag</label>
        <input type="text" ref={tagRef} />
        <div onClick={handleTag}>+</div>
        <ul>
            {
                tags.map((tag,idx)=>{
                    return(
                        <li key={idx}>
                            {tag}
                        </li>
                    )
                })
            }
        </ul>
        <br />
        <label htmlFor="photo">Image URL</label>
        <textarea name="photo" id="" cols="30" rows="10" ref={photoRef}></textarea>
        <br />
        <label htmlFor="timeRequired">Time Required for Cooking</label>
        <input type="number" ref={timeRequiredRef}/>
        <button type='submit' onClick={handleSubmit}>Add Recipe</button>
    </form>
  )
}

export default AddRecipe