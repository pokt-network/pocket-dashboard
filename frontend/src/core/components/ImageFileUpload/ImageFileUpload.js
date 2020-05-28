import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import "./ImageFileUpload.scss";
import {PropTypes} from "prop-types";
import {MAX_FILE_IMG_SIZE} from "../../../_constants";

function ImageFileUpload(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*",
    maxSize: MAX_FILE_IMG_SIZE,
    onDrop: (acceptedFiles, notAcceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      if (acceptedFiles[0]) {
        props.handleDrop(acceptedFiles[0]);
      } else {
        if (notAcceptedFiles[0].size > MAX_FILE_IMG_SIZE) {
          props.handleDrop(null, "Please upload a file smaller than 100kb");
        }
      }
    },
    multiple: false,
  });

  useEffect(() => {
    if (props.defaultImg) {
      setFiles([{preview: props.defaultImg}]);
    }
  }, [props.defaultImg]);

  const thumbs = files.map((file, idx) => (
    <React.Fragment key={idx}>
      {/*eslint-disable-next-line jsx-a11y/alt-text*/}
      <img src={file.preview} className="drop-border"/>
    </React.Fragment>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]
  );

  const renderDropZone = () => {
    if (thumbs.length > 0) {
      return thumbs;
    } else {
      return (
        <>
          <img src="/assets/upload_icon.svg" className="icon" alt=""/>
          <p>
            Drag and drop an icon{" "}
            <span className="alt">
              <br></br>or upload from your computer
            </span>
          </p>
        </>
      );
    }
  };

  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <div className="drop drop-border">
          <input {...getInputProps()} />
          {renderDropZone()}
        </div>
      </div>
    </section>
  );
}

ImageFileUpload.propTypes = {
  handleDrop: PropTypes.func,
  defaultImg: PropTypes.string,
};

export default ImageFileUpload;
