import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {Button} from "react-bootstrap";
import "./CardDisplay.scss";

class CardDisplay extends Component {
  render() {
    const {cardData, holder, onDelete} = this.props;

    return (
      <div className="card-display">
        <div className="info">
          <strong>
            {cardData.type} {cardData.digits}
          </strong>
          <p className="name">{holder}</p>
        </div>
        <Button variant="link" onClick={() => onDelete(cardData)}>
          Delete Card
        </Button>
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
