import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {Button, Row} from "react-bootstrap";
import "./CardDisplay.scss";

class CardDisplay extends Component {
  render() {
    const {cardData, holder, onDelete} = this.props;

    return (
      <div className="card-display">
        <div className="info">
          <strong className="text-capitalize">
            {cardData.type} {cardData.digits}
          </strong>
        </div>
        <span className="name">{holder}</span>
        {onDelete && (
          <Button
            className="font-weight-light"
            style={{fontSize: "1.1em"}}
            variant="link"
            onClick={() => onDelete(cardData)}
          >
            Delete Card
          </Button>
        )}
      </div>
    );
  }
}

CardDisplay.propTypes = {
  cardData: PropTypes.shape({
    type: PropTypes.string,
    digits: PropTypes.string,
  }),
  holder: PropTypes.string,
  onDelete: PropTypes.func,
};

export default CardDisplay;
