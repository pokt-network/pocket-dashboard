import React, {Component} from "react";
import "../Support/TermsOfService.scss";
import {withRouter} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";
import {scrollToId} from "../../_helpers";

class TermsOfService extends Component {
  state = {};
  render() {
    return (
      <Container fluid id="privacy-policy">
        <Navbar />

        <div className="wrapper">
          {/* eslint-disable-next-line react/prop-types */}
          <span className="go" onClick={this.props.history.goBack}>
            <img src="/assets/arrow-left.svg" alt="" className="icon" />
            <span className="text">Go back</span>
          </span>
          <br />
          <Row>
            <div className="address offset-lg-4">
              <p className="">POCKET NETWORK, INC. </p>
              <p>POKT TOKEN PURCHASE AGREEMENT</p>
            </div>
          </Row>
          <Row>
            <div className="policy">
              NOTICE: ​THE TERMS OF THIS AGREEMENT FORM A BINDING LEGAL CONTRACT
              BETWEEN YOU AND POCKET NETWORK, INC (THE “COMPANY”). CAREFULLY
              READ ALL OF THE TERMS OF THIS AGREEMENT BEFORE CLICKING THE “I
              AGREE” BUTTON. BY CLICKING THE “I AGREE” BUTTON YOU ACKNOWLEDGE
              YOUR CONSENT AND AGREEMENT TO ALL THE TERMS AND CONDITIONS SET
              FORTH IN THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL THE TERMS OF
              THIS AGREEMENT, DO NOT CLICK “I AGREE.” IF YOU HAVE ANY QUESTIONS
              REGARDING THE EFFECT OF THE TERMS AND CONDITIONS IN THIS
              AGREEMENT, YOU ARE ADVISED TO CONSULT INDEPENDENT LEGAL COUNSEL.
            </div>
            <br />
          </Row>
          <Row>
            <div className="collect">
              <span>Summary</span>
              <p>
                Review this POKT Token Purchase Agreement following your
                completion of certain questions on our online website platform
                http://dashboard.pokt.network/ (the “Purchasing Site”). If your
                responses remain accurate and correct, click the check box and
                the “I AGREE” button to indicate your agreement. <br />
                Purchase Price (USD): [____]
                <br />
                [Purchase Price (BTC): [____] (BTC/USD Exchange Rate: [____])]{" "}
                <br />
                [Purchase Price (ETH): [____] (ETH /USD Exchange Rate: [____])]{" "}
                <br />
                Number of POKT Tokens (Purchased Tokens): [____]
              </p>
            </div>
          </Row>
          <Row>
            <div className="information">
              <span>PREAMBLE</span>
              <p>
                This Token Purchase Agreement (this “Agreement”) contains the
                terms and conditions that govern your purchase of the POKT
                Tokens (the “Tokens” or “POKT Tokens”), and it defines your
                rights and obligations with respect to the purchased Tokens.
                This is an agreement between you (“Purchaser” or “you”) and
                Pocket Network, Inc, a Delaware corporation (the “Company”).
                Purchaser and the Company are herein referred to individually as
                a “Party” and collectively as the “Parties.”
              </p>
              <p>
                <b>WHEREAS​,</b>​ the Company created and minted the Tokens,
                which are a native digital asset intended to interact with and
                enable use of the Company’s blockchain application, the Pocket
                Network (the “Network”);
              </p>
              <p>
                <b>WHEREAS​,</b>​ the Company is collaborating with Pocket
                Network Foundation, an ownerless foundation company organized
                under the laws of the Cayman Islands, to develop and manage the
                Network;
              </p>
              <p>
                <b>WHEREAS​,</b> Purchaser desires to participate in the Network
                either as an application developer (“Developer”) or as a Pocket
                node (“Node”);
              </p>
              <p>
                <b>WHEREAS​,</b> in order to participate in the Network as a
                Developer or Node, Purchaser must acquire Tokens;
              </p>
              <p>
                <b>WHEREAS​,</b> the Company desires to issue and sell Tokens to
                select Network Developers and Nodes subject to purchase quantity
                maximums and use restrictions, requiring Purchaser to use Tokens
                in a specified way; and
              </p>
              <p>
                <b>WHEREAS​,</b> Purchaser desires to purchase from the Company,
                and the Company desires to issue and sell to Purchaser, Tokens
                in an amount and for the consideration set forth below.
              </p>
              <p>
                <b>NOW, THEREFORE​,</b>​ for good and valuable consideration,
                the receipt and sufficiency of which are hereby acknowledged,
                the Parties hereby agree as follows:
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>1. Purchase of Tokens.</span>
              <p>
                1.1. Subject to the Purchasing Site Terms of Use and the terms
                and conditions set forth herein, Purchaser, intending to be
                legally bound, hereby irrevocably agrees to purchase from the
                Company no more than 1,666,667 Tokens (the “Purchased Tokens”)
                at a purchase price of [$USD 0.0X] per token (the “Purchase
                Price), payable by fiat or cryptocurrency pursuant to the
                procedures set forth in this Agreement and via the Purchasing
                Site.{" "}
              </p>
              <p>
                1.2. This Agreement shall be effective and binding when
                Purchaser has entered the amount of Tokens Purchaser desires to
                purchase at the Purchase Price, clicks the check box and the “I
                AGREE” button on the Purchasing Site to indicate that Purchaser
                has read, acknowledges and agrees to the terms of this
                Agreement, executes this Agreement and submits this Agreement to
                the Company, and completes payment to the Company of the
                Purchase Price. Purchaser agrees to be bound on this basis and
                confirms that Purchaser has read in full and acknowledges this
                Agreement and the terms on which Purchaser is bound.{" "}
              </p>
              <p>
                1.3. Purchaser acknowledges and agrees that this agreement to
                purchase cannot be withdrawn, terminated, or revoked. This
                agreement to purchase shall be binding on the heirs, executors,
                administrators, successors and assigns of Purchaser. This
                agreement to purchase is not transferable or assignable by
                Purchaser, except as expressly provided in the terms and
                conditions of this Agreement.{" "}
              </p>
              <p>
                1.4. The Company has provided specific procedures on how
                Purchaser may seek to purchase Tokens through the Purchasing
                Site. By purchasing Tokens, Purchaser acknowledges, agrees to,
                and has no objection to such procedures and specifications.
                Purchaser further acknowledges and agrees that failure to
                properly use the Purchasing Site and follow such procedures,
                including the submission of all required documentation, may
                result in a rejection of Purchaser’s agreement to purchase and
                Purchaser not receiving any Tokens. Unauthorized access or use
                of the Purchasing Site or the receipt or purchase of Tokens
                pursuant to this Agreement through any other means are not
                sanctioned or agreed to in any way by the Company. Purchaser
                should take great care to verify the accuracy of the universal
                resource locator for the Purchasing Site used to purchase
                Tokens.
              </p>
              <p>
                1.5. Upon the basis of the representations and warranties, and
                subject to the terms and conditions, set forth herein, the
                Company agrees to issue and sell the Purchased Tokens to
                Purchaser on the Closing (as defined below) for the Purchase
                Price. 1.6. The Company shall consider Purchaser’s offer to
                purchase the Tokens upon the completion of the following:{" "}
              </p>
              <p>
                1.6.1 Purchaser creates an account via the Purchasing Site; and{" "}
              </p>
              <p>
                1.6.2. (i) Purchaser transfers funds in an amount equal to the
                Purchase Price from Purchaser’s bank account into the Company’s
                bank account, or (ii) Purchaser transfers cryptocurrency,
                including but not limited to bitcoin (BTC) or ether (ETH), in an
                amount equal to the Purchase Price from Purchaser’s digital
                wallet into the Company’s digital wallet, as provided by the
                Purchasing Site.{" "}
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>
                2. Termination or Rejection of Token Purchase Agreement.
              </span>
              <p>
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
                If this offer is rejected in whole this Agreement shall
                thereafter be of no further force or effect. If this offer is
                rejected in part, this Agreement will continue in full force and
                effect to the extent this subscription was accepted.
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>3. Acceptance of Purchase.</span> Upon the consummation of
              the purchase and sale of the Purchased Tokens and the other
              transactions contemplated hereby (the “Closing”), if the Company
              accepts this Agreement in whole or in part, the Company shall
              execute and deliver to Purchaser a counterpart executed copy of
              this Agreement dated as of the date the Company accepts
              Purchaser’s offer (the “Effective Date”).
              <p>
                3.1. The Company shall have no obligation hereunder until (i)
                Purchaser has executed and delivered to the Company this
                Agreement, (ii) Purchaser has deposited the Purchase Price in
                accordance with this Agreement, (iii) the Company has executed
                and delivered to Purchaser an executed copy of this Agreement,
                and (iv) all other conditions to Closing have been satisfied and
                the Closing has occurred.
              </p>
              <p>
                3.2. In the event that the Closing does not take place for any
                reason with respect to all or some of the Tokens within thirty
                (30) days of the Purchaser’s offer to buy Tokens, as determined
                in the sole discretion of the Company, the Company shall be
                deemed to have rejected this purchaser, either in whole or in
                part, in accordance with Section 2 hereof and the Company shall
                cause its payment services provider, to return promptly the
                rejected Purchase Price or the rejected portion thereof to
                Purchaser without deduction, offset or interest accrued thereon.
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>4. Purchase Maximum​.</span>
              <p>
                Purchaser shall be entitled to purchase a quantity of Tokens not
                to exceed the equivalent of (i) USD $50,000 divided by the
                Purchase Price for such Purchasers that have demonstrated their
                intent to become Developers, as indicated on the Purchasing
                Site, or (ii) USD $100,000 divided by the Purchase Price for
                such Purchasers that have demonstrated their intent to operate a
                Node, as indicated on the Purchasing Site.
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>5. Use Restriction and Restricted Period​.</span> Purchaser
              acknowledges that the Tokens purchased herein shall be subject to
              the Use Restriction (defined below) for the Restricted Period
              (defined below). Following the expiration of the Restricted Period
              and satisfaction of the Use Restriction, all Tokens purchased
              herein shall cease to be subject to the Restricted Period and Use
              Restriction.
              <p>
                5.1. “Use Restriction” means the requirement that Purchaser use
                all Tokens purchased, as appropriate to Purchaser’s intended
                participation in the Network. If Purchaser is a Developer,
                Purchaser’s Use Restriction requires staking Tokens, connecting
                the Purchaser’s application to the Network and requesting data
                from the Nodes on the Network using the Tokens. If Purchaser is
                a Node, Purchaser must use Tokens by staking Tokens and
                operating a Network node.
              </p>
              <p>
                {" "}
                5.1.1. In order to enforce the Use Restriction during the
                Restricted Period, upon purchase of the Tokens in accordance
                with Section 1.1, the Tokens shall be transferred to a digital
                asset wallet, to which the Purchaser maintains the sole private
                key (the “Restricted Wallet”). During the Restricted Period, the
                Company shall place restrictions on the Restricted Wallet to
                prevent Purchaser from transferring Tokens from the Restricted
                Wallet (the “Transfer Restrictions”). Upon the expiration of the
                Restricted Period, the Company shall remove the Transfer
                Restrictions from the Restricted Wallet.
              </p>
              <p>
                5.2. <b>“Restricted Period”</b> the general prohibition on the
                Purchaser’s ability to offer, sell, contract to sale, assign,
                transfer, spend, exchange, grant any option to purchase, or
                otherwise dispose of the Tokens for the period of one staking
                period from the Effective Date.
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>6. No Claim, Loan or Ownership Interest. </span>Except as
              otherwise expressly set forth herein, the purchase of Tokens: (i)
              does not provide Purchaser with rights of any form with respect to
              the Company or its revenues or assets, including, without
              limitation, any voting, distribution, redemption, liquidation,
              proprietary (including all forms of intellectual property) or
              other financial or legal rights; (ii) is not a loan to Company;
              and (iii) does not provide Purchaser with any ownership, equity,
              or other interest in the Company.
            </div>
          </Row>
          <Row>
            <div>
              <span>7. Intellectual Property. </span> Purchaser acknowledges and
              agrees that the Company retains all right, title and interest in
              all of the Company’s intellectual property contained in the
              Tokens, including, without limitation, inventions, ideas,
              concepts, code, discoveries, processes, marks, methods, software,
              compositions, formulae, techniques, information and data, whether
              or not patentable, copyrightable or protectable in trademark, and
              any trademarks, copyright or patents based thereon. Purchaser
              agrees not to use, reverse engineer, modify, or alter any of the
              Company’s intellectual property for any reason without the
              Company’s prior written consent.
            </div>
          </Row>
          <Row>
            <div>
              <span>8. Representations and Warranties of Purchaser. </span> In
              connection with the issuance and sale of the Tokens hereunder,
              Purchaser hereby represents and warrants to the Company that on
              the date hereof and as of the Effective Date:
              <p>
                8.1 Purchaser has all requisite power and authority to execute
                and deliver this Agreement, to purchase the Purchased Tokens,
                and to carry out and perform its obligations under this
                Agreement. All action on Purchaser’s part required for the
                lawful execution and delivery of this Agreement and other
                agreements required hereunder have been or will be effectively
                taken prior to the Effective Date. This Agreement has been duly
                executed by Purchaser. The Agreement constitutes a legal, valid
                and binding obligation of Purchaser enforceable against
                Purchaser in accordance with its terms, except that such
                enforceability may be limited by applicable bankruptcy,
                insolvency, reorganization, moratorium and similar laws of
                general application relating to or affecting creditors’ rights
                generally and by equitable principles (regardless of whether
                enforcement is sought in a proceeding in equity or at law).
              </p>
              <p>
                8.2. The Company’s dealings with Purchaser and others who may
                receive Tokens from the Company need not be uniform, and,
                without limiting the foregoing, the Company shall be entitled,
                among other things, to enter into agreements with such other
                recipients (and/or other persons) on terms different than those
                set forth herein.
              </p>
              <p>
                8.3. Purchaser is acquiring the Tokens with the primary
                intention to use the Tokens as either (i) a developer of an
                application that will run on the Network, or (ii) an operator of
                a node on the Network, and Purchaser represents and warrants
                that Purchaser has no current intent to resell the Tokens.
              </p>
              <p>
                8.4. Purchaser is fully aware of the risks associated with
                owning and using Tokens, including the inherent risk of the
                potential for Tokens, and/or the private keys to Tokens, to be
                lost, stolen, or hacked. By acquiring Tokens, Purchaser
                expressly acknowledges and assumes these risks.
              </p>
              <p>
                8.5. Purchaser has sufficient understanding of technical matters
                relating to Tokens, the Network, digital asset storage
                mechanisms (such as digital asset wallets), and blockchain
                technology, to understand how to acquire, store, and use Tokens,
                and to appreciate the risks and implications of acquiring
                Tokens.
              </p>
              <p>
                8.6. Purchaser understands that the Tokens confer no ownership
                or property rights of any form with respect to the Company,
                including, but not limited to, any ownership, distribution,
                redemption, liquidation, proprietary, governance, or other
                financial or legal rights.
              </p>
              <p>
                8.7. Purchaser acknowledges that the Company has made no
                representations or warranties whatsoever regarding the Tokens
                and their functionality, or the assets, business, financial
                condition or prospects of the Company.
              </p>
              <p>
                8.8. Purchaser shall execute such other documents as reasonably
                requested by the Company as necessary to comply with all
                applicable law.
              </p>
              <p>
                8.9. Purchaser acknowledges that the Company has made no
                representations or warranties whatsoever regarding the income
                tax consequences regarding the receipt or ownership of the
                Tokens.
              </p>
              <p>
                8.10. Purchaser represents that he or she has consulted with his
                or her advisors regarding the consequences, including the tax
                consequences, of acquiring Tokens.
              </p>
              <p>
                8.11. The execution, delivery and performance of this Agreement
                will not result in (i) any violation of, be in conflict with or
                constitute a material default under, with or without the passage
                of time or the giving of notice of, (A) any provision of
                Purchaser’s organizational documents, if applicable, (B) any
                provision of any judgment, decree or order to which Purchaser is
                a party, by which it is bound, or to which any of its assets are
                subject, (C) any agreement, obligation, duty or commitment to
                which Purchaser is a party or by which it is bound, or (D) any
                laws, statutes, ordinances, rules, regulations, judgments,
                injunctions, administrative interpretations, orders and decrees
                of any Governmental Authority, including amendments thereto
                (collectively, “Laws”); or (ii) the creation of any lien, charge
                or encumbrance upon any assets of Purchaser. “Governmental
                Authority” shall mean any nation or government, any state or
                other political subdivision thereof, any entity exercising
                legislative, executive, judicial or administrative functions of
                or pertaining to government, including without limitation any
                government authority, agency, department, board, commission or
                instrumentality and any court, tribunal or arbitrator(s) of
                competent jurisdiction and any self-regulatory organization. For
                the avoidance of doubt, Governmental Authority may include
                private bodies exercising quasi-governmental, regulatory or
                judicial-like functions to the extent they relate to either
                Parties or the Tokens.
              </p>
              <p>
                8.12. The execution and delivery of and performance under this
                Agreement require no approval or other action from any
                Governmental Authority or person or entity other than the
                Company, except for such consents, approvals, authorizations,
                orders, filings, registrations or qualifications as have already
                been obtained or made and are still in full force and effect.{" "}
              </p>
              <p>
                <b>8.13. Purchasing Site.</b>
                <ul>
                  <li>
                    8.13.1. Purchaser acknowledges that the Company has
                    established Terms of Use for the Purchasing Site, which
                    Terms of Use may be amended from time to time. Purchaser has
                    read and has complied with and agrees to continue to comply
                    with the Terms of Use for the Purchasing Site. Purchaser has
                    verified the accuracy of the universal resource locator for
                    the Purchasing Site used to purchase Tokens.{" "}
                  </li>
                  <li>
                    8.13.2. Purchaser acknowledges that Purchaser shall be
                    solely responsible for inputting and transmitting all
                    required documentation correctly and accurately.
                  </li>
                  <li>
                    8.13.3. Purchaser acknowledges access to the Purchasing Site
                    may be limited, unavailable or interrupted at any time,
                    including, but not limited to, during periods of peak
                    demand, system upgrades, maintenance, or during any other
                    events impacting Purchaser, Company or third party providers
                    providing systems or services necessary for the Purchasing
                    Site to be available and that the Company will not be
                    liable, and Purchaser will not attempt to hold the Company
                    liable, for any losses arising out of or relating to any
                    inaccuracies, duplications or errors in any purchase placed
                    on the Purchasing Site or resulting transactions.
                  </li>
                </ul>
              </p>{" "}
              <p>
                8.14.{" "}
                <b>
                  Sanctions Compliance; Anti-Money Laundering; Funds and
                  Payments.
                </b>
                <ul>
                  <li>
                    8.14.1. <b>Sanctions Compliance.</b> Neither Purchaser, nor
                    any person having a direct or indirect beneficial interest
                    in Purchaser or Tokens being acquired by Purchaser, or any
                    person for whom Purchaser is acting as agent or nominee in
                    connection with Tokens, has been or is (i) the subject of
                    sanctions administered or enforced by the United States
                    (including without limitation the U.S. Department of the
                    Treasury’s Office of Foreign Asset Control), the United
                    Kingdom, the European Union or any other Governmental
                    Authority (collectively, “Sanctions”), (ii) organized or
                    resident in a country or territory that is the subject of
                    country-wide or territory-wide Sanctions, or (iii) otherwise
                    a party with which the Company is prohibited from dealing
                    with under applicable laws.
                  </li>
                  <li>
                    8.14.2.{" "}
                    <b>Anti-money Laundering; Counter-Terrorism Financing.</b>{" "}
                    To the extent required by applicable laws, Purchaser has
                    complied and will continue to comply with all anti-money
                    laundering and counter-terrorism financing requirements.
                  </li>
                  <li>
                    8.14.3. <b>Funds and Payments.</b> The funds, including any
                    fiat, virtual currency or cryptocurrency, Purchaser uses to
                    purchase Tokens are not derived from or related to any
                    unlawful activities, including but not limited to money
                    laundering or terrorist financing, and Purchaser will not
                    use, or permit the use of, Tokens to finance, engage in or
                    otherwise support any unlawful activities. All payments by
                    or on behalf of Purchaser under this Agreement will be made
                    only in Purchaser’s name, from a digital wallet or bank
                    account not located in a country or territory that has been
                    designated as a “non-cooperative country or territory” by
                    the Financial Action Task Force, and is not a “foreign shell
                    bank” within the meaning of the U.S. Bank Secrecy Act (31
                    U.S.C. § 5311 et seq.), as amended, and the regulations
                    promulgated thereunder by the Financial Crimes Enforcement
                    Network, as such regulations may be amended from time to
                    time.
                  </li>
                </ul>
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>9. Representations and Warranties of the Company​. </span>In
              connection with the issuance and sale of the Tokens hereunder, the
              Company hereby represents and warrants to Purchaser that as of the
              date hereof and as of the Effective Date:
              <p>
                <ul>
                  <li>
                    9.1. The Company is a Delaware corporation, validly existing
                    and in good standing under the laws of the state of Delaware
                    and has all requisite corporate power and authority to carry
                    on its business as now conducted.
                  </li>
                  <li>
                    9.2. The Company has all requisite power and authority to
                    execute and deliver this Agreement and sell Tokens to
                    Purchaser and to carry out and perform its obligations under
                    this Agreement, in each case subject to the terms hereof.
                    The Agreement constitutes a legal, valid and binding
                    obligation of the Company enforceable against Company in
                    accordance with its terms.
                  </li>
                  <li>
                    9.3. This Agreement has been duly executed and delivered by
                    the Company, and, upon the Closing, the Tokens will have
                    been validly issued to Purchaser in accordance with the
                    terms hereof. This Agreement constitutes the legal, valid
                    and binding obligation of the Company, enforceable against
                    the Company in accordance with its terms (except as such
                    enforceability may be limited by applicable bankruptcy,
                    insolvency, reorganization, moratorium or similar Laws
                    affecting creditors’ rights generally and by general
                    principles of equity (whether considered in a proceeding at
                    law or equity)).
                  </li>
                  <li>
                    9.4. The execution, delivery and performance of this
                    Agreement will not result in: (i) any violation of, be in
                    conflict with in any material respect, or constitute a
                    material default under, with or without the passage of time
                    or the giving of notice (A) any provision of the Company’s
                    bylaws, (B) any provision of any judgment, decree or order
                    to which the Company is a party, by which it is bound, or to
                    which any of its material assets are subject, (C) any
                    material contract, obligation or commitment to which the
                    Company is a party or by which it is bound, or (D) any
                    applicable laws; or (ii) the creation of any material lien,
                    charge or encumbrance upon any material assets of the
                    Company.
                  </li>
                  <li>
                    9.5. The execution and delivery of and performance under
                    this Agreement require no approval or other action from any
                    Governmental Authority or person or entity other than the
                    Company, except for such consents, approvals,
                    authorizations, orders, filings, registrations or
                    qualifications as have already been obtained or made and are
                    still in full force and effect.
                  </li>
                </ul>
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>10. Termination. </span>
              <p>
                <ul>
                  <li>
                    10.1. <b>General Termination Right.</b> This Agreement may
                    be terminated by the Company by written (including
                    electronic) notice to Purchaser at any time prior to the
                    Effective Date, and any such termination shall be without
                    liability on the part of the Company (or any of its
                    affiliates, and its and their respective owners, directors,
                    officers, employees, agents, advisors, or other
                    representatives) to Purchaser. In the event of a termination
                    pursuant to this Section 9.1 (i) the Company shall cause its
                    payment services provider, to return promptly the Purchase
                    Price to Purchaser without deduction, offset or interest
                    accrued thereon, and (ii) this Agreement, and all of
                    Purchaser’s rights under this Agreement, shall immediately
                    terminate and shall thereafter be of no further force or
                    effect.
                  </li>
                  <li>
                    10.2. <b>Termination Upon Purchaser’s Breach.</b> In
                    addition to the rights in Section 9.1, the Company reserves
                    the right to terminate this Agreement, in its sole
                    discretion, in the event that Purchaser is in breach of any
                    term of this Agreement. In the event of a termination
                    pursuant to this Section 9.2 (i) all of Purchaser’s rights
                    in Tokens shall become immediately void and of no further
                    force and effect, (ii) all of Purchaser’s rights under this
                    Agreement shall immediately terminate, and (iii) Purchaser
                    shall not be entitled to any other recourse (including any
                    refund for any amounts paid to the Company in connection
                    with this Agreement).
                  </li>
                </ul>
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>
                <b>11. Indemnification​.</b> Purchaser hereby agrees to
                indemnify the Company, any of its affiliates, and its and their
                respective owners, directors, officers, employees,
                representatives and advisors, and to hold each of them harmless,
                from and against any loss, damage, liability, cost or expense,
                including reasonable attorneys’ fees and costs of investigation,
                to which they may be put or which they may reasonably incur or
                sustain due to or arising out of (i) any inaccuracy in or breach
                of any representation or warranty of Purchaser or its affiliates
                or agents, whether contained in this Agreement or any other
                document provided by Purchaser to the Company in connection with
                Purchaser’s purchase and use of the Tokens, or (ii) any
                nonfulfillment or breach of any covenant, agreement, or other
                provision by Purchaser or its affiliates or agents, whether
                contained in this Agreement or any other document provided by
                Purchaser to the Company in connection with Purchaser’s purchase
                and use the Tokens. All indemnification provisions shall survive
                the termination of this Agreement.
              </span>
            </div>
          </Row>
          <Row>
            <div>
              <span>12. Limitation of Liability; No Warranties. </span>
              <p>
                12.1. Except as expressly provided by this agreement and
                applicable laws, the Company shall not be responsible or liable
                for any losses resulting directly or indirectly from (i) any act
                or omission of Purchaser or agent of Purchaser or any error,
                negligence, or misconduct of Purchaser, (ii) failure of
                transmission or communication facilities, (iii) any other cause
                or causes beyond the Company’s control, including, without
                limitation, for reasons such as acts of God, fire, flood,
                strikes, work stoppages, acts of terrorism, governmental or
                regulatory action, delays of suppliers or subcontractors, war or
                civil disturbance, self-regulatory organization actions,
                telecommunication line or computer hardware failures and any
                other telecommunication failures, (iv) the Company’s reliance on
                any instructions, notices, or communications that it believes to
                be from an individual authorized to act on behalf of Purchaser,
                and Purchaser hereby waives any and all defenses that any such
                individual was not authorized to act on behalf of Purchaser, (v)
                government restrictions, exchange, regulatory, or market
                rulings, suspension of trading, military operations, terrorist
                activity, strikes, or any other condition beyond the Company’s
                control, including without limitation extreme market volatility
                or trading volume, or (vi) any action taken by Company to comply
                with applicable laws or this Agreement.
              </p>
              <p>
                12.2. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAWS AND
                RULES, THE COMPANY, ITS AFFILIATES, AND ITS CONTROLLING PERSONS,
                SHAREHOLDERS, DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS WILL NOT
                BE RESPONSIBLE FOR ANY LOSSES EXCEPT THAT THE COMPANY SHALL BE
                RESPONSIBLE FOR ANY LOSSES TO THE EXTENT THAT SUCH LOSSES ARISE
                FROM THE COMPANY’S GROSS NEGLIGENCE, FRAUD OR WILLFUL
                MISCONDUCT. IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES,
                CONTROLLING PERSONS, SHAREHOLDERS, DIRECTORS, OFFICERS,
                EMPLOYEES AND AGENTS BE LIABLE TO PURCHASER OR ANY THIRD PARTY
                FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY
                OR PUNITIVE DAMAGES, OR DAMAGES OF ANY KIND FOR LOST PROFITS OR
                REVENUES, TRADING LOSSES, INACCURATE DISTRIBUTIONS, LOSS OF
                BUSINESS OR DATA, EVEN IF ADVISED OF THE POSSIBILITY OF ANY SUCH
                DAMAGES AND REGARDLESS OF WHETHER SUCH LIABILITY IS ASSERTED ON
                THE BASIS OF CONTRACT, TORT OR OTHERWISE. FOR THE AVOIDANCE OF
                DOUBT, THIS PROVISION DOES NOT ACT AS A WAIVER OF ANY RIGHTS OF
                A PURCHASER UNDER THE FEDERAL SECURITIES LAWS, INCLUDING ANY
                RIGHTS UNDER THE SECURITIES ACT OF 1933, TO THE EXTENT SUCH A
                WAIVER IS AGAINST PUBLIC POLICY AS EXPRESSED IN THE ACT OR IS
                OTHERWISE UNENFORCEABLE.
              </p>
              <p>
                12.3. THE COMPANY AND ITS AFFILIATES MAKE NO REPRESENTATION OR
                WARRANTY, EXPRESS OR IMPLIED, AS TO THE SERVICES TO BE PROVIDED
                IN ACCORDANCE WITH THIS AGREEMENT, INCLUDING THE PURCHASING
                SITE, OR THE RESULTS TO BE ACHIEVED BY THE USE THEREOF. THE
                COMPANY AND ITS AFFILIATES DISCLAIM ALL EXPRESS, IMPLIED AND
                STATUTORY WARRANTIES INCLUDING, WITHOUT LIMITATION, INCLUDING
                WARRANTIES OF QUALITY, PERFORMANCE, NON INFRINGEMENT,
                MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE, NOR ARE
                THERE ANY WARRANTIES CREATED BY COURSE OF DEALING, COURSE OF
                PERFORMANCE OR TRADE USAGE. THE COMPANY AND AFFILIATES DO NOT
                GUARANTEE THE ACCURACY, QUALITY, SEQUENCE, TIMELINESS,
                RELIABILITY, PERFORMANCE, COMPLETENESS, CONTINUED AVAILABILITY,
                TITLE OR NON-INFRINGEMENT OF ANY DATA OR THIRD PARTY PROVIDER
                SERVICES USED IN RELATION TO THE AGREEMENT AND EACH DISCLAIMS
                ANY EXPRESS OR IMPLIED WARRANTIES. THE SERVICES TO BE PROVIDED
                BY THE COMPANY (INCLUDING THE PURCHASING SITE) ARE PROVIDED ON
                AN “AS-IS”, “AS AVAILABLE” BASIS WITHOUT WARRANTY OF ANY KIND TO
                THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAWS AND RULES. FOR
                THE AVOIDANCE OF DOUBT, THIS PROVISION DOES NOT ACT AS A WAIVER
                OF ANY RIGHTS OF A PURCHASER UNDER THE FEDERAL SECURITIES LAWS,
                INCLUDING ANY RIGHTS UNDER THE SECURITIES ACT OF 1933, TO THE
                EXTENT SUCH A WAIVER IS AGAINST PUBLIC POLICY AS EXPRESSED IN
                THE ACT OR IS OTHERWISE UNENFORCEABLE.
              </p>
            </div>
          </Row>
          <Row>
            <div>
              <span>13. Miscellaneous.</span>
              <p>
                <ul>
                  <li>
                    13.1. <b>Survival.</b> Notwithstanding anything to the
                    contrary herein, the provisions of Sections 4, 5, 6, 7, 8,
                    10, and 11 shall survive the termination of this Agreement.
                  </li>
                  <li>
                    13.2. <b>Counterparts.</b> This Agreement may be executed in
                    any number of counterparts (including by means of facsimile
                    and electronic mail (including portable document format
                    (pdf) or any electronic signature complying with the U.S.
                    federal ESIGN Act of 2000, e.g., www.docusign.com)), each of
                    which shall be an original but all of which together shall
                    constitute one and the same instrument.
                  </li>
                  <li>
                    13.3. <b>No Assignment.</b> This Agreement shall be binding
                    upon and inure to the benefit of the Parties. Further, (i)
                    POKT Tokens acquired pursuant to this Agreement may be
                    transferred only as set forth in herein, (ii) the Company
                    may assign or transfer this Agreement without Purchaser’s
                    consent to its successors and assigns, including an
                    affiliate of the Company, and (iii) Purchaser may not assign
                    this Agreement without the prior written consent of the
                    Company. Any purported assignment in violation of this
                    provision shall be a breach of this Agreement and void ab
                    initio.
                  </li>
                  <li>
                    13.4. <b>Governing Law; Venue.</b> This Agreement shall be
                    governed by and construed in accordance with the domestic
                    Laws of the state of Delaware without giving effect to any
                    choice or conflict of laws provision or rule (whether of the
                    state of Delaware or any other jurisdiction) that would
                    cause the application of the Laws of any jurisdiction other
                    than the state of Delaware. EACH PARTY HEREBY IRREVOCABLY
                    AND UNCONDITIONALLY CONSENTS TO SUBMIT TO THE EXCLUSIVE
                    JURISDICTION OF ANY STATE AND FEDERAL COURTS LOCATED WITHIN
                    DELAWARE FOR ANY ACTION, PROCEEDING OR INVESTIGATION
                    (“LITIGATION”) ARISING OUT OF OR RELATING TO THIS AGREEMENT
                    AND THE TRANSACTIONS CONTEMPLATED HEREBY (AND AGREES NOT TO
                    COMMENCE ANY LITIGATION RELATING THERETO EXCEPT IN SUCH
                    VENUES).
                  </li>
                  <li>
                    13.5. <b>Amendment.</b> No amendment of any provision of
                    this Agreement shall be valid unless the same shall be in
                    writing and signed by the Company and Purchaser.
                  </li>
                  <li>
                    13.6. <b>Entire Agreement.</b> his Agreement constitutes the
                    entire agreement among the Parties and supersedes any prior
                    understandings, agreements, or representations by or among
                    the Parties, written or oral, to the extent they relate in
                    any way to the subject matter hereof.
                  </li>
                  <li>
                    13.7. <b>Notices.</b> All notices, requests, demands and
                    other communications hereunder shall be in writing and shall
                    be deemed to have been duly given to any Party when
                    delivered by hand, when delivered by electronic mail, or
                    when mailed, first-class postage prepaid (i) if to
                    Purchaser, at the electronic mail address set forth below
                    Purchaser’s signature, or to such other electronic mail
                    address as Purchaser shall have furnished to the Company in
                    writing, and (ii) if to the Company, to it at 4465 West
                    Gandy Boulevard, Tampa, FL 33611, or to such other address
                    or addresses or electronic mail address or addresses, as the
                    Company shall have furnished to Purchaser in writing
                    (provided that notice by electronic mail to the Company
                    shall not be deemed given unless the Company has
                    affirmatively acknowledged receipt of such notice).
                  </li>
                  <li>
                    13.8. <b>Severability.</b> If any provision of this
                    Agreement is determined by a court of competent jurisdiction
                    to be invalid, illegal, inoperative or unenforceable for any
                    reason, this Agreement shall continue in full force and
                    effect, it being intended that all rights and obligations of
                    the Parties hereunder shall be enforceable to the fullest
                    extent permitted by law, and the Parties shall negotiate in
                    good faith to modify this Agreement so as to effect the
                    original intent of the Parties as closely as possible in an
                    acceptable manner in order that the transactions
                    contemplated hereby be consummated as originally
                    contemplated to the fullest extent possible.
                  </li>
                  <li>
                    13.9. <b>Termination Upon Purchaser’s Breach.</b> No
                    Third-Party Beneficiaries. The terms and provisions of this
                    Agreement are intended solely for the benefit of each Party
                    and their respective successors and assigns, and it is not
                    the intention of the Parties to confer, and no provision
                    hereof shall confer, third-party beneficiary rights upon any
                    other person.
                  </li>
                  <li>
                    13.10. <b>Electronic Communications.</b> Purchaser agrees
                    and acknowledges that all agreements, notices, disclosures
                    and other communications that the Company may provide to
                    Purchaser pursuant to this Agreement or in connection with
                    or related to Purchaser’s purchase or ownership of Tokens,
                    including this Agreement, may be provided by the Company, in
                    its sole discretion, to Purchaser in electronic form.
                  </li>
                  <li>
                    13.11. <b>Headings.</b> The headings used in this Agreement
                    have been inserted for convenience of reference only and do
                    not define or limit the provisions hereof.
                  </li>
                  <li>
                    13.12. <b>Construction.</b> The Parties acknowledge that
                    each of them has had the benefit of legal counsel of its own
                    choice and has been afforded an opportunity to review this
                    Agreement with its legal counsel and that this Agreement
                    shall be construed as if jointly drafted by the Parties.
                  </li>
                  <li>
                    13.13. <b>Available Rights and Waivers.</b> No failure or
                    delay by any Party in exercising any right, power or
                    privilege under this Agreement shall operate as a waiver
                    thereof nor shall any single or partial exercise thereof
                    preclude any other or further exercise thereof or the
                    exercise of any other right, power or privilege. The rights
                    and remedies herein provided shall be cumulative and not
                    exclusive of any rights or remedies provided by law.
                  </li>
                </ul>
              </p>
            </div>
          </Row>
          <br />
          <span
            className="go top mb-5"
            onClick={() => scrollToId("privacy-policy")}
          >
            <img src="/assets/arrow-up.svg" alt="" className="icon" />
            <span className="text">Go to Top</span>
          </span>
        </div>
      </Container>
    );
  }
}

export default withRouter(TermsOfService);
