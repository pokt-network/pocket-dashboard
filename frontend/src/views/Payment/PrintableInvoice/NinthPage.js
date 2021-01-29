import React from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";

const now = new Date();

class NinthPage extends React.Component {
  render() {
    const { cardHolderName } = this.props;

    return (
      <div
        className="token-purchase-agreement"
        style={{ pageBreakAfter: "always" }}
      >
        <Logo />
        <p className="mb-5" style={{ paddingLeft: "60px" }}>
          exercise thereof or the exercise of any other right, power or
          privilege. The rights and remedies herein provided shall be cumulative
          and not exclusive of any rights or remedies provided by law.
        </p>
        <p style={{ paddingLeft: "60px", marginBottom: 0 }}>
          The Company hereby formally accepts Purchaser&lsquo;s offer, as set
          forth in the Token Purchase Terms and Conditions by and
        </p>
        <p>
          between the Company and {cardHolderName.toUpperCase()} as of the date
          written below.
        </p>
        <div className="invoice-pokt-info">
          <h4 className="text-uppercase">
            <b>the company:</b>
          </h4>
          <h4 className="text-uppercase mt-5">pocket network, inc</h4>
          <div className="mt-5">
            <div className="invoice-signature-wrapper">
              <span>By:</span>
              <img
                className="invoice-ceo-signature"
                alt="Michael O'Rourke"
                src={"/assets/MS.jpg"}
              />
            </div>
          </div>
          <div className="mt-5">Name: Michael O&quot;Rourke</div>
          <div>Title: President</div>
          <div className="mt-5">Address:</div>
          <div>
            802 East Whiting Street <br />
            Tampa, FL 33602
          </div>
          <div className="mt-5">
            Date: {now.getMonth() + 1}/{now.getDate()}/{now.getFullYear()}
          </div>
        </div>
      </div>
    );
  }
}

NinthPage.defaultProps = {
  cardHolderName: "",
};

NinthPage.propTypes = {
  cardHolderName: PropTypes.string,
};

export default NinthPage;
