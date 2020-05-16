import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import "./ImageFileUpload.scss";
import {PropTypes} from "prop-types";

function ImageFileUpload(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      props.handleDrop(acceptedFiles[0]);
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
