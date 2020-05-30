import React, {Component} from "react";
import "./AppOrderSummary.scss";
import {PropTypes} from "prop-types";
import LoadingButton from "../LoadingButton";
import {Form} from "react-bootstrap";

class AppOrderSummary extends Component {
  state = {};
  render() {
    const {
      formActionHandler,
      actionButtonName,
      items,
      balance,
      balanceOnChange,
      loading,
      total,
    } = this.props;

    return (
      <div className="summary pb-1">
        {items.map((it, idx) => (
          <div className="item" key={idx}>
            <p>{it.label}</p>
            <p>{it.quantity}</p>
          </div>
        ))}
        <div className="item">
          <p>Current balance</p>
          <Form.Control value={balance} onChange={balanceOnChange} />
        </div>
        <hr />
        <div className="item total">
          <p>Total cost</p>
          <p>{total} USD</p>
        </div>
        <LoadingButton
          loading={loading}
          buttonProps={{
            onClick: formActionHandler,
            variant: "primary",
            className: "action",
          }}
        >
          <span>{actionButtonName}</span>
        </LoadingButton>
      </div>
    );
  }
}

AppOrderSummary.defaultProps = {
  actionButtonName: "Check Out",
};

AppOrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  formActionHandler: PropTypes.func,
  actionButtonName: PropTypes.string,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  balanceOnChange: PropTypes.func,
  loading: PropTypes.bool,
};

export default AppOrderSummary;
