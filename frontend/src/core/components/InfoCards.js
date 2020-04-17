import React, {Component} from "react";
import {Col} from "react-bootstrap";
import InfoCard from "./InfoCard/InfoCard";
import {PropTypes} from "prop-types";

class InfoCards extends Component {
  state = {};
  render() {
    const {cards} = this.props;

    return (
      <>
        {/*eslint-disable-next-line react/prop-types*/}
        {cards.map((card, idx) => (
          <Col key={idx}>
            <InfoCard title={card.title} subtitle={card.subtitle}>
              {card.children}
            </InfoCard>
          </Col>
        ))}
      </>
    );
  }
}

InfoCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]),
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      subtitle: PropTypes.string.isRequired,
    })
  ),
};

export default InfoCards;
