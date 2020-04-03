import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Button} from "react-bootstrap";
import "./ImageFileUpload.scss";
import {PropTypes} from "prop-types";

function ImageFileUpload(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      props.handleDrop(acceptedFiles[0]);
    },
  });

  const thumbs = files.map((file, idx) => (
    <React.Fragment key={idx}>
      {/*eslint-disable-next-line jsx-a11y/alt-text*/}
      <img src={file.preview} className="drop-border" />
    </React.Fragment>
  ));

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]
  );

  const renderDropZone = () => {
    if (thumbs.length > 0) {
      return thumbs;
    } else {
      return (
        <>
          <p className="mt-3">Drag and drop an icon or upload from your PC</p>
          <Button className="pr-5 pl-5" variant="dark">
            Upload
          </Button>
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
};

export default ImageFileUpload;
