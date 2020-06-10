import React from "react";
import Logo from "./Logo";

class FourthPage extends React.Component {
  render() {
    return (
      <div
        className="token-purchase-agreement"
        style={{pageBreakAfter: "always"}}
      >
        <Logo />
        <p>
          satisfaction of the Use Restriction, all Tokens purchased herein shall
          cease to be subject to the Restricted Period and Use Restriction.
        </p>
        <ol className="ordered-list">
          <li>
            <p>
              &quot;<u>Use Restriction</u>&quot; means the requirement that
              Purchaser use all Tokens purchased, as appropriate to Purchaser’s
              intended participation in the Network. If Purchaser is a
              Developer, Purchaser’s Use Restriction requires staking Tokens,
              connecting the Purchaser’s application to the Network and relaying
              data over the Network using the Tokens. If Purchaser is a Node,
              Purchaser must use Tokens by staking Tokens and operating a
              Network node.
            </p>
          </li>
          <ol className="ordered-list">
            In order to enforce the Use Restriction during the Restricted
            Period, upon purchase of the Tokens in accordance with Section 1.1,
            the Tokens shall be transferred to a digital asset wallet, to which
            the Purchaser maintains the sole private key (the &quot;
            <u>Restricted Wallet</u>&quot;). During the Restricted Period, the
            Company shall place restrictions on the Restricted Wallet to prevent
            Purchaser from transferring Tokens from the Restricted Wallet (the
            &quot;<u>Transfer Restrictions</u>&quot;). Upon the expiration of
            the Restricted Period, the Company shall remove the Transfer
            Restrictions from the Restricted Wallet.
          </ol>
          <li>
            <p>
              &quot;<u>Restricted Period</u>&quot; the general prohibition on
              the Purchaser&lsquo;s ability to offer, sell, contract to sale,
              assign, transfer, spend, exchange, grant any option to purchase,
              or otherwise dispose of the Tokens for the period of one staking
              period from the Effective Date.
            </p>
          </li>
        </ol>
        <ol className="bold-ordered-list" start="6">
          <li>
            <p>
              <b>
                <u>No Claim, Loan or Ownership Interest.</u>{" "}
              </b>
              Except as otherwise expressly set forth herein, the purchase of
              Tokens: (i) does not provide Purchaser with rights of any form
              with respect to the Company or its revenues or assets, including,
              without limitation, any voting, distribution, redemption,
              liquidation, proprietary (including all forms of intellectual
              property) or other financial or legal rights; (ii) is not a loan
              to Company; and (iii) does not provide Purchaser with any
              ownership, equity, or other interest in the Company.
            </p>
          </li>
          <li>
            <p>
              <b>
                <u>Intellectual Property.</u>{" "}
              </b>{" "}
              Purchaser acknowledges and agrees that the Company retains all
              right, title and interest in all of the Company&lsquo;s intellectual
              property contained in the Tokens, including, without limitation,
              inventions, ideas, concepts, code, discoveries, processes, marks,
              methods, software, compositions, formulae, techniques, information
              and data, whether or not patentable, copyrightable or protectable
              in trademark, and any trademarks, copyright or patents based
              thereon. Purchaser agrees not to use, reverse engineer, modify, or
              alter any of the Company’s intellectual property for any reason
              without the Company’s prior written consent.
            </p>
          </li>
          <li>
            <p>
              <b>
                <u>Representations and Warranties of Purchaser.</u>
              </b>
              In connection with the issuance and sale of the Tokens hereunder,
              Purchaser hereby represents and warrants to the Company that on
              the date hereof and as of the Effective Date:
            </p>
          </li>
          <ol className="ordered-list">
            <li>
              <p>
                Purchaser has all requisite power and authority to execute and
                deliver this Agreement, to purchase the Purchased Tokens, and to
                carry out and perform its obligations under this Agreement. All
                action on Purchaser’s part required for the lawful execution and
                delivery of this Agreement and other agreements required
                hereunder have been or will be effectively taken prior to the
                Effective Date. This Agreement has been duly executed by
                Purchaser. The Agreement constitutes a legal, valid and binding
                obligation of Purchaser enforceable against Purchaser in
                accordance with its terms, except that such enforceability may
                be limited by applicable bankruptcy, insolvency, reorganization,
                moratorium and similar laws of general application relating to
                or affecting creditors’ rights generally and by equitable
                principles (regardless of whether enforcement is sought in a
                proceeding in equity or at law).
              </p>
            </li>
            <li>
              <p>
                The Company’s dealings with Purchaser and others who may receive
                Tokens from the Company need not be uniform, and, without
                limiting the foregoing, the Company shall be entitled, among
                other things, to enter into agreements with such other
                recipients (and/or other persons) on terms different than those
                set forth herein.
              </p>
            </li>
            <li>
              <p>
                Purchaser is acquiring the Tokens with the primary intention to
                use the Tokens as either (i) a developer of an application that
                will run on the Network, or (ii) an operator of a node on the
                Network, and Purchaser represents and warrants that Purchaser
                has no current intent to resell the Tokens.
              </p>
            </li>
            <li>
              <p>
                Purchaser is fully aware of the risks associated with owning and
                using Tokens, including the inherent risk of the potential for
                Tokens, and/or the private keys to Tokens, to be lost, stolen,
                or hacked. By acquiring Tokens, Purchaser expressly acknowledges
                and assumes these risks.
              </p>
            </li>
            <li>
              <p>
                Purchaser has sufficient understanding of technical matters
                relating to Tokens, the Network, digital asset storage
                mechanisms (such as digital asset wallets), and blockchain
                technology, to understand how to acquire, store, and use Tokens,
                and to appreciate the risks and implications of acquiring
                Tokens.
              </p>
            </li>
          </ol>
        </ol>
      </div>
    );
  }
}

export default FourthPage;
