import React from "react";
import Logo from "./Logo";

class ThirdPage extends React.Component {
  render() {
    return (
      <div
        className="token-purchase-agreement"
        style={{pageBreakAfter: "always"}}
      >
        <Logo />
        <ol className="ordered-list" start="3">
          <li>
            <p>
              Purchaser acknowledges and agrees that this agreement to purchase
              cannot be withdrawn, terminated, or revoked. This agreement to
              purchase shall be binding on the heirs, executors, administrators,
              successors and assigns of Purchaser. This agreement to purchase is
              not transferable or assignable by Purchaser, except as expressly
              provided in the terms and conditions of this Agreement.
            </p>
          </li>
          <li>
            <p>
              The Company has provided specific procedures on how Purchaser may
              seek to purchase Tokens through the Purchasing Site. By purchasing
              Tokens, Purchaser acknowledges, agrees to, and has no objection to
              such procedures and specifications. Purchaser further acknowledges
              and agrees that failure to properly use the Purchasing Site and
              follow such procedures, including the submission of all required
              documentation, may result in a rejection of Purchaser’s agreement
              to purchase and Purchaser not receiving any Tokens. Unauthorized
              access or use of the Purchasing Site or the receipt or purchase of
              Tokens pursuant to this Agreement through any other means are not
              sanctioned or agreed to in any way by the Company. Purchaser
              should take great care to verify the accuracy of the universal
              resource locator for the Purchasing Site used to purchase Tokens.
            </p>
          </li>
          <li>
            <p>
              Upon the basis of the representations and warranties, and subject
              to the terms and conditions, set forth herein, the Company agrees
              to issue and sell the Purchased Tokens to Purchaser on the Closing
              (as defined below) for the Purchase Price.
            </p>
          </li>
          <li>
            <p>
              The Company shall consider Purchaser’s offer to purchase the
              Tokens upon the completion of the following:
            </p>
            <ol className="ordered-list">
              <li>
                <p>Purchaser creates an account via the Purchasing Site; and</p>
              </li>
              <li>
                <p>
                  (i) Purchaser transfers funds in an amount equal to the
                  Purchase Price from Purchaser’s bank account into the
                  Company’s bank account, or (ii) Purchaser transfers [bitcoin
                  (BTC) and ether (ETH)] in an amount equal to the Purchase
                  Price from Purchaser’s digital wallet into the Company’s
                  digital wallet, as provided by the Purchasing Site.
                </p>
              </li>
            </ol>
          </li>
        </ol>
        <ol className="bold-ordered-list" start="2">
          <li>
            <p>
              <b>
                <u>Termination or Rejection of Token Purchase Agreement.</u>
              </b>{" "}
              Purchaser acknowledges and agrees that the Company, in its sole
              discretion, reserves the right to accept or reject this or any
              other agreement to purchase Tokens, in whole or in part, and for
              any reason or no reason, notwithstanding prior receipt by
              Purchaser of notice of acceptance of this Agreement. If the
              Company rejects a purchase, either in whole or in part (which
              decision is in its sole discretion), the Company shall cause its
              payment services provider, as applicable, to return promptly the
              rejected Purchase Price or the rejected portion thereof to
              Purchaser without deduction, offset or interest accrued thereon.
              If this offer is rejected in whole this Agreement shall thereafter
              be of no further force or effect. If this offer is rejected in
              part, this Agreement will continue in full force and effect to the
              extent this subscription was accepted.
            </p>
          </li>
          <li>
            <p>
              <b>
                <u>Acceptance of Purchase.</u>
              </b>{" "}
              Upon the consummation of the purchase and sale of the Purchased
              Tokens and the other transactions contemplated hereby (the
              “Closing”), if the Company accepts this Agreement in whole or in
              part, the Company shall execute and deliver to Purchaser a
              counterpart executed copy of this Agreement dated as of the date
              the Company accepts Purchaser’s offer (the “Effective Date”).
              [NTD: this requires Company to send a copy of this Agreement to
              Purchaser after signing.]
            </p>
          </li>
          <ol className="ordered-list">
            <li>
              <p>
                The Company shall have no obligation hereunder until (i)
                Purchaser has executed and delivered to the Company this
                Agreement, (ii) Purchaser has deposited the Purchase Price in
                accordance with this Agreement, (iii) the Company has executed
                and delivered to Purchaser an executed copy of this Agreement,
                and (iv) all other conditions to Closing have been satisfied and
                the Closing has occurred.
              </p>
            </li>
            <li>
              <p>
                In the event that the Closing does not take place for any reason
                with respect to all or some of the Tokens within thirty (30)
                days of the Purchaser’s offer to buy Tokens, as determined in
                the sole discretion of the Company, the Company shall be deemed
                to have rejected this purchaser, either in whole or in part, in
                accordance with Section 2 hereof and the Company shall cause its
                payment services provider, to return promptly the rejected
                Purchase Price or the rejected portion thereof to Purchaser
                without deduction, offset or interest accrued thereon.
              </p>
            </li>
          </ol>
          <li>
            <p>
              <b>
                <u>Purchase Maximun.</u>
              </b>{" "}
              Purchaser shall be entitled to purchase a quantity of Tokens not
              to exceed the equivalent of (i) USD $10,000 divided by the
              Purchase Price for such Purchasers that have demonstrated their
              intent to become Developers, as indicated on the Purchasing Site,
              and (ii) USD $100,000 divided by the Purchase Price for such
              Purchasers that have demonstrated their intent to operate a Node,
              as indicated on the Purchasing Site.
            </p>
          </li>
          <li>
            <p>
              <b>
                <u>Use Restriction and Restricted Period.</u>
              </b>{" "}
              Purchaser acknowledges that the Tokens purchased herein shall be
              subject to the Use Restriction (defined below) for the Restricted
              Period (defined below). Following the expiration of the Restricted
              Period and
            </p>
          </li>
        </ol>
      </div>
    );
  }
}

export default ThirdPage;
