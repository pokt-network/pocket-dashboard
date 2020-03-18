import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import "./Help.scss";

const Help = () => {
  return (
    <div className={"help"}>
      <Button variant={"link"}>
        <FontAwesomeIcon icon={faQuestionCircle} />
      </Button>
    </div>
  );
};

export default Help;
