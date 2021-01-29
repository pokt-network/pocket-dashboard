import React from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";
import InfoItem from "./InfoItem";

class FirstPage extends React.Component {
  render() {
    const { invoiceItems, purchaseDetails, total } = this.props;

    return (
      <div className="invoice-page">
        <Logo />
        <h1>your invoice</h1>
        <hr />
        {invoiceItems.map((item, index) => (
          <InfoItem
            key={`invoice-info-item-${index}`}
            text={item.text}
            value={item.value}
          />
        ))}
        <div className="title-background">
          <h2>purchase detail</h2>
        </div>
        {purchaseDetails.map((item, index) => (
          <InfoItem
            key={`purchase-detail-item-${index}`}
            text={item.text}
            value={item.value}
          />
        ))}
        <div className="title-background">
          <InfoItem text="total cost" value={total} />
        </div>
      </div>
    );
  }
}

FirstPage.defaultProps = {
  invoiceItems: [],
  purchaseDetails: [],
};

FirstPage.propTypes = {
  invoiceItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  purchaseDetails: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  total: PropTypes.string,
};

export default FirstPage;
