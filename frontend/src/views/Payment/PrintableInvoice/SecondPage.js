import React from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";

class SecondPage extends React.Component {
  render() {
    const {poktPrice, purchasedTokens} = this.props;
    const purchasedTokensTotal = purchasedTokens < 0 ? 0.00 : (purchasedTokens / 1000000).toFixed(6);

    return (
      <div
        className="token-purchase-agreement"
        style={{pageBreakAfter: "always", maxWidth: "80%", margin: "auto"}}
      >
        <Logo />
        <h3>POCKET NETWORK, INC</h3>
        <h3 className="mb-5">
          <u>POKT Token Purchase Agreement</u>
        </h3>
        <p className="mb-5">
          <b>NOTICE:</b> THE TERMS OF THIS AGREEMENT FORM A BINDING LEGAL CONTRACT BETWEEN YOU AND POCKET NETWORK,
          INC (THE “COMPANY”). CAREFULLY READ ALL OF THE TERMS OF THIS AGREEMENT BEFORE CLICKING THE “I AGREE” BUTTON.
          BY CLICKING THE “I AGREE” BUTTON YOU ACKNOWLEDGE YOUR CONSENT AND AGREEMENT TO ALL THE TERMS AND CONDITIONS SET
          FORTH IN THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL THE TERMS OF THIS AGREEMENT, DO NOT CLICK “I AGREE.” IF YOU
          HAVE ANY QUESTIONS REGARDING THE EFFECT OF THE TERMS AND CONDITIONS IN THIS AGREEMENT, YOU ARE ADVISED TO CONSULT
          INDEPENDENT LEGAL COUNSEL.
        </p>
        <h6 className="mb-3">
          <u>SUMMARY</u>
        </h6>
        <p>
          Review this POKT Token Purchase Agreement following your completion of certain questions on our online website platform
          {" "}
          <a
            target= "_blank"
            rel="noopener noreferrer"
            href="https://dashboard.pokt.network/"
            style={{textDecoration: "none"}}
          >
            https://dashboard.pokt.network/
          </a>{" "}
          (the “Purchasing Site”). If your responses remain accurate and correct,
          click the checkbox and the “I AGREE” button to indicate your agreement.
        </p>
        <h6 className="mb-3">
          <u>PREAMBLE</u>
        </h6>
        <p>
          This Token Purchase Agreement (this “Agreement”) contains the terms
          and conditions that govern your purchase of the POKT Tokens (the “
          <u>Tokens</u>” or “<u>POKT Tokens</u>”), and it defines your rights
          and obligations with respect to the purchased Tokens. This is an
          agreement between you (“<u>Purchaser</u>” or “<u>you</u>”) and{" "}
          <u>Pocket Network, Inc</u>, a Delaware corporation (the “
          <u>Company</u>”). Purchaser and the Company are herein referred to
          individually as a “<u>Party</u>” and collectively as the “
          <u>Parties.</u>”
        </p>
        <p>
          <b className="text-uppercase">WHEREAS</b>, the Company created and
          minted the Tokens, which are a native digital asset intended to
          interact with and enable use of the Company’s blockchain application,
          the Pocket Network (the “<u>Network</u>”);
        </p>
        <p>
          <b className="text-uppercase">WHEREAS</b>, the Company is
          collaborating with Pocket Network Foundation, an ownerless foundation
          company organized under the laws of the Cayman Islands, to develop and
          manage the Network;
        </p>
        <p>
          <b className="text-uppercase">WHEREAS</b>, Purchaser desires to
          participate in the Network either as an application developer (“
          <u>Developer</u>”) or as a Pocket node (“<u>Node</u>”);
        </p>
        <p>
          <b className="text-uppercase">WHEREAS</b>, in order to participate in
          the Network as a Developer or Node, Purchaser must acquire Tokens; and
        </p>
        <p>
          <b className="text-uppercase">WHEREAS</b>, Purchaser desires to
          purchase from the Company, and the Company desires to issue and sell
          to Purchaser, Tokens in an amount and for the consideration set forth
          on the Purchasing Site.
        </p>
        <p>
          <b className="text-uppercase">NOW, THEREFORE</b>, for good and
          valuable consideration, the receipt and sufficiency of which are
          hereby acknowledged, the Parties hereby agree as follows:
        </p>
        <ol className="bold-ordered-list">
          <li>
            <b>
              <u>Purchase of Tokens.</u>
            </b>
          </li>
          <ol className="ordered-list">
            <li>
              <p>
                Subject to the Purchasing Site Terms of Use and the terms and
                conditions set forth herein, Purchaser, intending to be legally
                bound, hereby irrevocably agrees to purchase from the Company{" "}
                {purchasedTokensTotal} Tokens (the “
                <u>Purchased Tokens</u>”) at a purchase price of $USD{" "}
                {poktPrice} per token (the &quot;
                <u>Purchase Price</u>&quot;), payable by [ETH, USD, BTC]
                pursuant to the procedures set forth in this Agreement and via
                the Purchasing Site.
              </p>
            </li>
            <li>
              <p>
                This Agreement shall be effective and binding when Purchaser has
                entered the amount of Tokens Purchaser desires to purchase at
                the Purchase Price, clicks the check box and the “I AGREE”
                button on the Purchasing Site to indicate that Purchaser has
                read, acknowledges and agrees to the terms of this Agreement,
                executes this Agreement and submits this Agreement to the
                Company, and completes payment to the Company of the Purchase
                Price. Purchaser agrees to be bound on this basis and confirms
                that Purchaser has read in full and acknowledges this Agreement
                and the terms on which Purchaser is bound.
              </p>
            </li>
          </ol>
        </ol>
      </div>
    );
  }
}

SecondPage.defaultProps = {
  poktPrice: "0",
  purchasedTokens: 0,
};

SecondPage.propTypes = {
  poktPrice: PropTypes.string,
  purchasedTokens: PropTypes.number,
};

export default SecondPage;
