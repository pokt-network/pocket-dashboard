import React from "react";
import Logo from "./Logo";

class SixthPage extends React.Component {
  render() {
    return (
      <div
        className="token-purchase-agreement"
        style={{ pageBreakAfter: "always" }}
      >
        <Logo />
        <ol className="ordered-list-new-page" start="2">
          <li>
            <p>
              <b>Anti-money Laundering; Counter-Terrorism Financing.</b>
              To the extent required by applicable laws, Purchaser has complied
              and will continue to comply with all anti-money laundering and
              counter-terrorism financing requirements.
            </p>
          </li>
          <li>
            <p>
              <b>Funds and Payments.</b>
              The funds, including any fiat, virtual currency or cryptocurrency,
              Purchaser uses to purchase Tokens are not derived from or related
              to any unlawful activities, including but not limited to money
              laundering or terrorist financing, and Purchaser will not use, or
              permit the use of, Tokens to finance, engage in or otherwise
              support any unlawful activities. All payments by or on behalf of
              Purchaser under this Agreement will be made only in Purchaser’s
              name, from a digital wallet or bank account not located in a
              country or territory that has been designated as a
              “non-cooperative country or territory” by the Financial Action
              Task Force, and is not a “foreign shell bank” within the meaning
              of the U.S. Bank Secrecy Act (31 U.S.C. § 5311 et seq.), as
              amended, and the regulations promulgated thereunder by the
              Financial Crimes Enforcement Network, as such regulations may be
              amended from time to time.
            </p>
          </li>
        </ol>
        <ol className="bold-ordered-list" start="9">
          <li>
            <p>
              <b>
                <u>Representations and Warranties of the Company.</u>
              </b>{" "}
              In connection with the issuance and sale of the Tokens hereunder,
              the Company hereby represents and warrants to Purchaser that as of
              the date hereof and as of the Effective Date:
            </p>
          </li>
          <ol className="ordered-list">
            <li>
              <p>
                The Company is a Delaware corporation, validly existing and in
                good standing under the laws of the state of Delaware and has
                all requisite corporate power and authority to carry on its
                business as now conducted.
              </p>
            </li>
            <li>
              <p>
                The Company has all requisite power and authority to execute and
                deliver this Agreement and sell Tokens to Purchaser and to carry
                out and perform its obligations under this Agreement, in each
                case subject to the terms hereof. The Agreement constitutes a
                legal, valid and binding obligation of the Company enforceable
                against Company in accordance with its terms.
              </p>
            </li>
            <li>
              <p>
                This Agreement has been duly executed and delivered by the
                Company, and, upon the Closing, the Tokens will have been
                validly issued to Purchaser in accordance with the terms hereof.
                This Agreement constitutes the legal, valid and binding
                obligation of the Company, enforceable against the Company in
                accordance with its terms (except as such enforceability may be
                limited by applicable bankruptcy, insolvency, reorganization,
                moratorium or similar Laws affecting creditors’ rights generally
                and by general principles of equity (whether considered in a
                proceeding at law or equity)).
              </p>
            </li>
            <li>
              <p>
                The execution, delivery and performance of this Agreement will
                not result in: (i) any violation of, be in conflict with in any
                material respect, or constitute a material default under, with
                or without the passage of time or the giving of notice (A) any
                provision of the Company’s bylaws, (B) any provision of any
                judgment, decree or order to which the Company is a party, by
                which it is bound, or to which any of its material assets are
                subject, (C) any material contract, obligation or commitment to
                which the Company is a party or by which it is bound, or (D) any
                applicable laws; or (ii) the creation of any material lien,
                charge or encumbrance upon any material assets of the Company.
              </p>
            </li>
            <li>
              <p>
                The execution and delivery of and performance under this
                Agreement require no approval or other action from any
                Governmental Authority or person or entity other than the
                Company, except for such consents, approvals, authorizations,
                orders, filings, registrations or qualifications as have already
                been obtained or made and are still in full force and effect.
              </p>
            </li>
          </ol>
          <li>
            <p>
              <b>
                <u>Termination.</u>
              </b>
            </p>
          </li>
          <ol className="ordered-list">
            <li>
              <p>
                <b>General Termination Right.</b> This Agreement may be
                terminated by the Company by written (including electronic)
                notice to Purchaser at any time prior to the Effective Date, and
                any such termination shall be without liability on the part of
                the Company (or any of its affiliates, and its and their
                respective owners, directors, officers, employees, agents,
                advisors, or other representatives) to Purchaser. In the event
                of a termination pursuant to this Section 9.1 (i) the Company
                shall cause its payment services provider, to return promptly
                the Purchase Price to Purchaser without deduction, offset or
                interest accrued thereon, and (ii) this Agreement, and all of
                Purchaser’s rights under this Agreement, shall immediately
                terminate and shall thereafter be of no further force or effect.
              </p>
            </li>
            <li>
              <p>
                <b>Termination Upon Purchaser’s Breach.</b> In addition to the
                rights in Section 9.1, the Company reserves the right to
                terminate this Agreement, in its sole discretion, in the event
                that Purchaser is in breach of any term of this Agreement. In
                the event of a termination pursuant to this Section9.2 (i) all
                of Purchaser’s rights in Tokens shall become immediately void
                and of no further force and effect, (ii) all of Purchaser’s
                rights under this Agreement shall immediately terminate, and
                (iii) Purchaser shall not be entitled to any other recourse
                (including any refund for any amounts paid to the Company in
                connection with this Agreement).
              </p>
            </li>
          </ol>
          <li>
            <p>
              <b>
                <u>Indemnification.</u>
              </b>{" "}
              Purchaser hereby agrees to indemnify the Company, any of its
              affiliates, and its and their respective owners, directors,
              officers, employees, representatives and advisors, and to hold
              each of them harmless, from and against any loss,
            </p>
          </li>
        </ol>
      </div>
    );
  }
}

export default SixthPage;
