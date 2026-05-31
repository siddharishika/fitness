import React, { useState } from "react";
import { IconContext } from "react-icons";

import { IoAddOutline } from "react-icons/io5";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../store/thunks/admin";
import { IKUpload } from "imagekitio-react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Upload(tags) {
  const navigate = useNavigate();
  let [file, setFile] = useState();
  let fileRef = useRef();
  let nameRef = useRef("");
  let tagRef = useRef("");
  var [fileId, setFileId] = useState();
  var [filePath, setFilePath] = useState();
  var [fileUrl, setFileUrl] = useState();
  var [ImgFileId, setImgFileId] = useState();
  var [ImgFilePath, setImgFilePath] = useState();
  var [ImgFileUrl, setImgFileUrl] = useState();
  var [flag, setFlag] = useState(false);
  var [flag2, setFlag2] = useState(false);
  let [arr, setArr] = useState([]);

  const handlePlus = (e) => {
    e.preventDefault();
    let arr1 = [...arr, tagRef.current.value];
    setArr(arr1);
  };

  let formData = {};
  function fn(fileId, filePath, fileUrl) {}
  const onSuccess = (res) => {
    setFileId(res.fileId);
    setFilePath(res.filePath);
    setFileUrl(res.url);
    setFlag(true);
    return res;
  };
  const onSuccess2 = (res) => {
    setImgFileId(res.fileId);
    setImgFilePath(res.filePath);
    setImgFileUrl(res.url);
    setFlag2(true);
  };

  let handleSubmit = async function (e) {
    e.preventDefault();

    formData.name = nameRef.current.value;
    formData.tags = arr;
    formData.fileId = fileId;
    formData.filePath = filePath;
    formData.fileUrl = fileUrl;
    formData.imgFileId = ImgFileId;
    formData.imgFilePath = ImgFilePath;
    formData.imgFileUrl = ImgFileUrl;

    if (flag) {
      try {
        let res = await axios.post(
          `${API_BASE_URL}/addvideo`,
          { formData },
          { withCredentials: true },
        );
        navigate("/");
      } catch (e) {}
    } else {
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="name">Video Title:</label>
        <input
          ref={nameRef}
          type="text"
          placeholder="Video Title"
          id="name"
          name="name"
          required
        />
        <label htmlFor="fitnessVideo"></label>
        <label htmlFor="Video">Video:</label>
        <IKUpload
          placeholder="Video"
          onSuccess={onSuccess}
          fileName={name}
          folder={"/fitness"}
          useUniqueFileName={false}
          isPrivateFile={false}
          required
        />
        <label htmlFor="Image">Image:</label>
        <IKUpload
          fileName={name + "img"}
          placeholder="Image"
          folder={"/fitnessImages"}
          onSuccess={onSuccess2}
        />
        <input type="text" ref={tagRef} />
        <IconContext.Provider
          value={{ color: "black", className: "global-class-name" }}
        >
          <div className="plus">
            <IoAddOutline onClick={handlePlus} />
          </div>
        </IconContext.Provider>
        <ul>
          {arr &&
            arr.map(function (ele, idx) {
              return <li key={idx}>{ele}</li>;
            })}
        </ul>
        <button type="submit">Upload File</button>
      </form>
    </>
  );
}

export default Upload;
