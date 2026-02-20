import React, { createElement, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function EditProgram() {
  let location = useLocation();
  let data = location.state;
  let navigate = useNavigate();
  let [ingredients, setIngredients] = useState(data.ingredients);
  let [process, setProcess] = useState(data.process);
  let ingredientRef = useRef();
  let processRef = useRef();
  let [tags, setTags] = useState(data.tags);
  let tagRef = useRef();
  let timeRequiredRef = useRef();
  let nameRef = useRef();
  let descriptionRef = useRef();
  let photoRef = useRef();

  const handleIngredients = (e) => {
    let arr = [...ingredients];
    let obj = {};
    obj.ingredient = ingredientRef.current.value;
    obj.amount = 0;
    arr.push(obj);
    setIngredients(arr);
  };
  const handleAmount = (idx) => {
    let arr = [];
    let amount = document.getElementById("amount" + idx);
    for (let i = 0; i < ingredients.length; i++) {
      if (i == idx) {
        let obj = {};
        obj.ingredient = ingredients[i].ingredient;
        obj.amount = amount.value;
        arr.push(obj);
      } else {
        arr.push(ingredients[i]);
      }
    }
    setIngredients(arr);
  };
  const handleProcess = (e) => {
    let arr = [...process];
    arr.push(processRef.current.value);
    setProcess(arr);
  };
  const handleTag = (e) => {
    let arr = [...tags];
    arr.push(tagRef.current.value);
    setTags(arr);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {};
    data.timeRequired = timeRequiredRef.current.value;
    data.process = process;
    data.tags = tags.join(",");
    data.ingredients = ingredients;
    data.name = nameRef.current.value;
    data.description = descriptionRef.current.value;
    data.photo = photoRef.current.value;

    try {
      let res = await axios.post(`${API_BASE_URL}/recipe/edit`, data, {
        withCredentials: true,
      });
      if (
        res.data.success == false &&
        res.data.message == "You need to be authenticated to access this page!"
      ) {
        navigate("/login");
        return;
      }
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };
  return (
    <form method="POST">
      AddRecipe
      <label htmlFor="name">Name of Recipe</label>
      <input type="text" ref={nameRef} defaultValue={data.name}/>
      <br />
      <label htmlFor="Ingredients">Ingredient</label>
      <input type="text" ref={ingredientRef} />
      <div onClick={handleIngredients}>+</div>
      <br />
      <ul>
        {ingredients && ingredients.map((ele, idx) => {
          return (
            <li key={idx}>
              <div>{ele.ingredient}</div>
              <label htmlFor="amount">Amont of ingredient in grams</label>
              <input type="text" name="" id={"amount" + idx} />
              <div onClick={(e) => handleAmount(idx)}>+</div>
              <div>{ele.amount}</div>
            </li>
          );
        })}
      </ul>
      <br />
      <label htmlFor="description">Description of the Recipe</label>
      <textarea
        name="description"
        id=""
        cols="30"
        rows="10"
        ref={descriptionRef}
        defaultValue={data.description}
      ></textarea>
      <br />
      <label htmlFor="process">Process</label>
      <textarea
        name="process"
        id=""
        cols="30"
        rows="10"
        ref={processRef}
      ></textarea>
      <div onClick={handleProcess}>+</div>
      <br />
      <ul>
        {process && process.map((ele, idx) => {
          return <li key={idx}>{ele}</li>;
        })}
      </ul>
      <br />
      <label htmlFor="tags">Tag</label>
      <input type="text" ref={tagRef} />
      <div onClick={handleTag}>+</div>
      <ul>
        {tags && tags.map((tag, idx) => {
          return <li key={idx}>{tag}</li>;
        })}
      </ul>
      <br />
      <label htmlFor="photo">Image URL</label>
      <textarea
        name="photo"
        id=""
        cols="30"
        rows="10"
        ref={photoRef}
        defaultValue={data.photo}
      ></textarea>
      <br />
      <label htmlFor="timeRequired">Time Required for Cooking</label>
      <input type="number" ref={timeRequiredRef} defaultValue={data.timeRequired} />
      <button type="submit" onClick={handleSubmit}>
        Add Recipe
      </button>
    </form>
  );
}

export default EditProgram;
