import React, {Component} from "react";
import {Col} from "react-bootstrap";
import {PropTypes} from "prop-types";

class Invoice extends Component {
  state = {};
  render() {
    const {information, items, total, title} = this.props;

    return (
      <Col className="invoice">
        <h2 className="text-uppercase">{title}</h2>
        <hr />
        <div>
          {information.map((item, idx) => (
            <div key={idx} className="field">
              <span>{item.text}:</span>
              <span>{item.value}</span>
            </div>
          ))}
          <hr />
          <p className="text-uppercase detail">Purchase detail</p>
          {items.map((item, idx) => (
            <div key={idx} className="field">
              <span>{item.text}:</span>
              <span>{item.value}</span>
            </div>
          ))}
          <hr />
          <div className="label field mt-4 total">
            <span> Total Cost:</span>
            <span>{`${total} USD`}</span>
          </div>
        </div>
      </Col>
    );
  }
}

Invoice.propTypes = {
  information: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
};

export default Invoice;
