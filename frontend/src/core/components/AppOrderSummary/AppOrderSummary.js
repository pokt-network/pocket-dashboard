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
      <div className="summary">
        {items.map((it, idx) => (
          <div className="item" key={idx}>
            <span>{it.label}</span>
            <span>{it.quantity}</span>
          </div>
        ))}
        <div className="item current-balance">
          <span>Current balance</span>
          <Form.Control value={balance} onChange={balanceOnChange} />
        </div>
        <hr />
        <div className="item total">
          <span>Total cost</span>
          <span>{total} USD</span>
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
