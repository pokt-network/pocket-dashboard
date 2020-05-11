import React, {Component} from "react";
import {Col} from "react-bootstrap";
import {PropTypes} from "prop-types";

class Invoice extends Component {
  state = {};
  render() {
    const {information, items, total, title} = this.props;

    return (
      <Col>
        <h2>{title}</h2>
        <hr />
        <div className="invoice">
          {information.map((item, idx) => (
            <div key={idx} className="field pl-3 pr-3">
              <p className="font-weight-bold">{item.text}</p>
              <p>{item.value}</p>
            </div>
          ))}
          <p className="label">Purchase detail</p>
          {items.map((item, idx) => (
            <div key={idx} className="field pl-3 pr-3">
              <p className="font-weight-bold">{item.text}</p>
              <p>{item.value}</p>
            </div>
          ))}
          <div className="label field pl-3">
            <p className="font-weight-bold">Total Cost:</p>
            <p>{total}</p>
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
