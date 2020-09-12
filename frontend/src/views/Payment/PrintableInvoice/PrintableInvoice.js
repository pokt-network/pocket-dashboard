import React, {Component} from "react";
import PropTypes from "prop-types";
import "./PrintableInvoice.scss";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import ThirdPage from "./ThirdPage";
import FourthPage from "./FourthPage";
import FifthPage from "./FifthPage";
import SixthPage from "./SixthPage";
import SeventhPage from "./SeventhPage";
import EigthPage from "./EigthPage";
import NinthPage from "./NinthPage";

class PrintableInvoice extends Component {

  render() {
    const {
      invoiceItems,
      purchaseDetails,
      total,
      cardHolderName,
      poktPrice,
      purchasedTokens,
    } = this.props;

    return (
      <div className="printable-invoice">
        <FirstPage
          invoiceItems={invoiceItems}
          purchaseDetails={purchaseDetails}
          total={total}
        />
        <SecondPage
          poktPrice={poktPrice}
          purchasedTokens={purchasedTokens}
        />
        <ThirdPage />
        <FourthPage />
        <FifthPage />
        <SixthPage />
        <SeventhPage />
        <EigthPage />
        <NinthPage cardHolderName={cardHolderName} />
      </div>
    );
  }
}

PrintableInvoice.defaultProps = {
  invoiceItems: [],
  purchaseDetails: [],
  cardHolderName: "",
  poktPrice: "0",
};

PrintableInvoice.propTypes = {
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
  cardHolderName: PropTypes.string,
  poktPrice: PropTypes.string,
  purchasedTokens: PropTypes.number,
};

export default PrintableInvoice;
