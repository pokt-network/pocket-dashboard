import React, {Component} from "react";
import "./SupportPages.scss";
import {withRouter} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";
import {scrollToId} from "../../_helpers";

class TermsOfService extends Component {
  state = {};
  function;
  render() {
    return (
      <Container fluid id="terms-of-use">
        <Navbar />
        <div className="wrapper">
            {/* eslint-disable-next-line react/prop-types */}
            <span className="go" onClick={this.props.history.goBack}>
              <img src="/assets/arrow-left.svg" alt="" className="icon" />
              <span className="text">Go back</span>
          </span>
          <br />
          <Row>
            <div className="title">
              <p style={{fontWeight: "700"}}>Site Terms Of Use<br/></p>
            </div>
            <br></br>

          </Row>
          <Row>
          <h2>
              <strong>
                POCKET NETWORK, INC. and POCKET NETWORK FOUNDATION
              </strong>
            </h2>
          </Row>
          <Row>
          <p>
              <strong>Date of Last Update:&nbsp;July 2, 2020</strong>
            </p>
          </Row>
          <Row>
            <div className="secondary-font-family mt-5">
              These Terms of Use (“<strong>Terms</strong>”) are entered into
              between you and Pocket Network Inc., a Delaware Corporation, and
              Pocket Network Foundation, a Cayman Islands Foundation Company
              (Pocket Network Inc. and Pocket Network Foundation are referred to
              as “<strong>we</strong>,” “<strong>us</strong>,” or “
              <strong>our”</strong>). All references to “<strong>you</strong>”
              or “<strong>your</strong>” (as applicable) mean the person or the
              organization who accesses or uses the Websites and Services (as
              defined below) in any manner.
            </div>
            <br />
          </Row>
          <Row>
            <div className="secondary-font-family mt-5">
              By accessing or using the Websites and Services, you agree to be
              bound by these Terms and any other rules or policies that we adopt
              and publish from time to time, which are incorporated herein by
              reference (which collectively constitute the “
              <strong>Agreement</strong>“). This Agreement govern your access to
              and use of the website (URL:{" "}
              <a href="https://www.pokt.network/">https://www.pokt.network/</a>)
              and its subdomains (the “<strong>Websites</strong>”) and any
              products, software, services, accounts, and tools provided by us
              through the Websites (the “<strong>Services</strong>”). Your use
              of any Services is also subject to additional terms notified to
              you as being applicable to such Services, which also form part of
              this Agreement. Please do not use the Websites or Services if you
              do not agree to be bound by this Agreement.
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p>
                <u>Access and Availability</u>
              </p>
              <br></br>
              <ol>
                <li>
                  <strong>Conditions of Use. </strong>Your access and use of the
                  Websites and Services are conditional upon your acceptance of
                  and compliance with this Agreement.
                </li>
                <li>
                  <strong>Access and Use by Organization. </strong>If you access
                  or use the Website and Services on behalf of an organization,
                  you represent and warrant that you have the authority to enter
                  into this Agreement on behalf of that organization and to bind
                  that organization to such terms (and references to “you” in
                  this Agreement refer to that organization).
                </li>
                <li>
                  <strong>Services not offered to Sanctioned Persons. </strong>
                  The Websites and Services are not offered to, or intended to
                  be used by, any person or entity that is the subject of
                  sanctions administered or enforced by any country or
                  government or otherwise designated on any list of prohibited
                  or restricted parties (including but not limited to the lists
                  maintained by the United Nations Security Council, the U.S.
                  Government, the European Union or its Member States, or other
                  applicable government authority) or organized or resident in a
                  country or territory that is the subject of country-wide or
                  territory-wide sanctions. You represent and warrant that
                  neither you nor any party having a direct or indirect
                  beneficial interest in you or on whose behalf you are acting
                  as agent or nominee is such a person or entity and you will
                  comply with all applicable import, re-import, sanctions,
                  anti-boycott, export, and re-export control laws and
                  regulations. If this is not accurate or you do not agree, then
                  you must immediately cease accessing our Websites and
                  Services.
                </li>
                <li>
                  <strong>Availability. </strong>We do not guarantee that the
                  Websites and Services will always be available or
                  uninterrupted. From time to time we may decide to temporarily
                  restrict or block access to, or use of, all or part of the
                  Websites and Services without notice and reserve the right to
                  do so for business or operational reasons.
                </li>
                <li>
                  <strong>Withdrawal and Amendments. </strong>We reserve the
                  right to withdraw and/or amend any features of the Websites
                  and Services without notice (save to the extent otherwise set
                  out in these Terms) and we accept no liability, no matter how
                  that may be caused, arising from us doing so.
                </li>
              </ol>
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p>
                <u>Accounts and Security Information</u>
              </p>
              <br></br>
              <ol>
                <li>
                  <strong>Account Registration. </strong>You may be required to
                  register an account with us to have access or use some of our
                  Services. Your registration for and use of our accounts are
                  subject to the additional terms of use notified to you at the
                  time of your account registration, which form part of this
                  Agreement.
                </li>
                <li>
                  <strong>Security Information. </strong>To use our Website and
                  Services, you may be required to choose, or be provided with,
                  a user identification code, password or any other piece of
                  information as part of the Websites’ security procedures (the
                  “<strong>Security Information</strong>”). You shall treat such
                  Security Information as confidential and you must not disclose
                  it to any third party.
                </li>
                <li>
                  <strong>Liability. </strong>We are not liable for any loss or
                  damage that you may incur as a result of someone else using or
                  accessing your Security Information to access or use the
                  Websites and Services, either with or without your knowledge.
                  However, you could be held liable for losses incurred by us or
                  another party due to someone else’s access to or use of the
                  Websites and Services via the use of your Security
                  Information.
                </li>
              </ol>
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p>
                <u>Data Privacy</u>
              </p>
              <br></br>
              <ol>
                <li>
                  <strong>Privacy Policy </strong>We are committed to protecting
                  the privacy of your information. Please review our Privacy
                  Policy for details about how we process your personal data in
                  connection with your access and use of the Websites and
                  Services. The Privacy Policy is available here.
                </li>
                <li>
                  <strong>Cookies</strong>. We use necessary cookies to make the
                  Websites and Services work. We may also use optional cookies
                  to improve our Websites and Services, but you will only get
                  the benefit of such improvements if you enable cookies through
                  your browser settings. For more information about how we use
                  cookies, please read our Privacy Policy.
                </li>
              </ol>
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p>
                <u>Open Source Software</u>
              </p>
              <br></br>
              <ol>
                <li>
                  <strong>Download and Availability. </strong>We may make the
                  source code for certain software we develop available for
                  download as open source software on the Websites or on{" "}
                  <a href="https://github.com/pokt-network">
                    https://github.com/pokt-network
                  </a>
                  . If you use any such open source software, you agree to be
                  bound by and comply with the license terms that apply to such
                  open source software. You will not indicate that you are
                  associated with us in connection with your use, modifications
                  or distributions of such open source software.
                </li>
                <li>
                  <strong>License Terms. </strong>If we host any proprietary
                  software and enable you to access and use such software
                  through the Websites and Services, then this Agreement will
                  apply to such access and use, in addition to any license
                  agreements that we may enter into with you.
                </li>
              </ol>
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p>
                <u>Intellectual Property</u>
              </p>
              <br></br>
              <ol>
                <li>
                  <strong>Ownership.&nbsp;</strong>The Websites and Services are
                  owned by us and protected by copyright, trademark, and other
                  intellectual property rights and laws of applicable countries,
                  unless otherwise specifically indicated. You agree to abide by
                  all applicable proprietary rights and laws, as well as any
                  trademark or copyright notices or restrictions contained in
                  this Agreement. The trademarks, service marks, slogans, logos,
                  trade dress and other identifiers (“<strong>Marks</strong>”)
                  displayed on the Websites and Services are our property,
                  unless otherwise stated.
                </li>
                <li>
                  <strong>Prohibitions. </strong>You are prohibited from
                  modifying, copying, displaying, distributing, transmitting,
                  publishing, selling, licensing, creating derivative works
                  from, or using any portions of the Websites and Services for
                  commercial or public purposes without our express
                  authorization or as expressly permitted by applicable
                  copyright or trademark law. You may not copy any part of the
                  materials on the Websites and Services without our express
                  prior written authorization and subject to our copyright
                  notice being affixed to the copied material. Nothing contained
                  herein shall be construed as conferring by implication,
                  estoppel, or otherwise any license or right under any of our
                  patent, trademark, copyright or other proprietary rights for
                  any purpose not expressly set out in this Agreement.
                </li>
                <li>
                  <strong>No Transfer.&nbsp;</strong>By using the Services, no
                  right, title, or interest in or to the Websites and Services
                  is transferred to you. All rights are reserved by us.
                </li>
                <li>
                  <strong>Use of Materials. </strong>Except as otherwise
                  indicated elsewhere on the Websites, you may view, download
                  and print the materials available on the Websites subject to
                  the following conditions:
                </li>
              </ol>
              <div>
                <ol>
                  <li>
                    the materials must be used solely for personal,
                    informational, internal, non-commercial purposes;
                  </li>
                  <li>
                    the materials must not be modified or altered in any way;
                  </li>
                  <li>the materials must not be distributed;</li>
                  <li>
                    you must not remove any copyright or other proprietary
                    notices contained in the materials;
                  </li>
                  <li>
                    we reserve the right to revoke the authorization to view,
                    download, and print the materials available on the Websites
                    at any time, and any such use shall be discontinued
                    immediately upon written notice from us; and
                  </li>
                  <li>
                    the rights granted to you constitute a non-exclusive license
                    and not a transfer of title.
                  </li>
                </ol>
              </div>
            </div>
          </Row>
          <Row>
            <p>
              <u>Third-Party Resources</u>
            </p>
            <br></br>
            <ol>
              <li>
                <strong>Third-Party Resources. </strong>We may display
                information, links and other material on our Websites relating
                to third-party software, hardware, services, networks,
                blockchains (whether public or private), websites or other
                resources (collectively, the “
                <strong>Third-Party Resources</strong>”) for your convenience
                only. Your use of any Third-Party Resources, and any third party
                that provides any Third-Party Resources, are solely between you
                and such third parties and is governed by such licenses and
                terms of use as specified by such third parties, and we are not
                responsible or liable in any manner for such use or
                interactions.
              </li>
              <li>
                <strong>Availability; Disclaimer. </strong>We are not
                responsible for any Third-Party Resources and all materials
                about them are provided on an “as-is” and “as available” basis.
                Any copyright or other intellectual property rights in the
                Third-Party Resources remain the property of their respective
                authors and owners. The inclusion of any materials does not
                constitute approval, endorsement or recommendation by us of any
                Third-Party Resources or any third party, and we disclaim all
                responsibility and liability for your use of any Third-Party
                Resources.
              </li>
              <li>
                <strong>No Warranty. </strong>No information obtained by you
                from our Websites shall create any warranty in respect of any
                Third-Party Resources. We make no representation, warranty,
                guarantee or undertaking of any kind in respect of any
                Third-Party Resources, including without limitation as to the
                effectiveness, security, functionality, operation, reliability,
                quality, accuracy, validity, legality or intellectual property
                rights compliance of any Third-Party Resources.
              </li>
              <li>
                <strong>Updates and Amendments. </strong>Third-Party Resources
                may be updated, changed or terminated at any time, and any
                materials provided on our Websites may be or become out of date
                or inaccurate.
              </li>
              <li>
                <strong>Third-Party Blockchain Services. </strong>Our Services
                may contain or require the use of third-party blockchain
                services or technologies, including blockchains created and
                maintained by others (“
                <strong>Third-Party Blockchain Services</strong>”). We make no
                representation or warranty as to the accuracy, completeness,
                reliability, merchantability, or fitness for a particular
                purpose of Third-Party Blockchain Services accessed through our
                Services nor any commitment. Usage of and reliance on such
                Third-Party Services are entirely at your own risk.
              </li>
              <li>
                <strong>Protection and Back-up. </strong>You are solely
                responsible for adequate protection and backup of the data and
                equipment used in connection with any Third-Party Blockchain
                Services. We are not liable for any damages that you suffer in
                connection with any Third-Party Blockchain Services, including
                without limitation in connection with accessing, relying on,
                downloading, installing, using, modifying or distributing any
                Third-Party Blockchain Services.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>Warranties and Disclaimers</u>
            </p>
            <br></br>
            <ol>
              <li>
                <strong>‘As is’ / ‘as available’. </strong>The Websites and
                Services are provided on the “as is” and “as available” basis
                without warranty or condition of any kind, either express or
                implied, including, but not limited to, the implied terms of
                satisfactory quality, merchantability or fitness for a
                particular purpose.<strong>No Warranty. </strong>We make no
                representation or warranty nor accept any obligation to ensure
                that:
                <ol>
                  <li>
                    the Websites and Services will meet your requirements;
                  </li>
                  <li>
                    the Websites and Services will be uninterrupted, timely,
                    secure, or error-free;
                  </li>
                  <li>
                    the results that may be obtained from the use of the
                    Websites and Services will be effective, accurate or
                    reliable; and
                  </li>
                  <li>
                    the quality of any Websites or Services will meet your
                    expectations.
                  </li>
                </ol>
              </li>
              <li>
                <strong>.Survival. </strong>The disclaimers and exclusions set
                out in this Agreement survive any termination or expiration of
                your access to or use of the Websites and Services and any
                termination or expiry of this Agreement.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>Limitation of Liability and Indemnification</u>
            </p>
            <ol>
              <li>
                <strong>Limitation of Liability. </strong>In no event shall we
                be liable for damages of any kind (including any direct,
                indirect, special, incidental, consequential, or punitive
                damages) arising out of or in connection with your access to,
                use of, or inability to use, the Website and Services. In
                addition, we are not liable for any errors, omissions,
                misstatements, or misrepresentations (whether express or
                implied) concerning any information on the Websites or Services.
              </li>
              <li>
                <strong>Indemnification</strong>. You shall indemnify, defend,
                and hold us, and our directors, officers, agents,
                representatives, co-branders or other partners, and employees,
                harmless from and against any claim, demand, suit, proceeding,
                cause of action, including all reasonable attorneys’ fees and
                expenses, made by any third party or suffered or incurred by us
                or them as a result of, arising out of or in connection with:
              </li>
            </ol>
              <div>
                <ol>
                  <li>
                    the content you submit, transmit, store or process through
                    the Websites and Services;
                  </li>
                  <li>
                    your conduct in connection with the Websites or Services;
                  </li>
                  <li>your access to or use of the Websites and Services;</li>
                  <li>
                    your violation of this Agreement (inclusive of all terms
                    relating to any Services); or
                  </li>
                  <li>
                    your violation of any rights of another person or entity.
                  </li>
                </ol>
              </div>
          </Row>
          <Row>
            <p>
              <u>Acceptable Use Policy</u>
            </p>
            <ol>
              <li>
                <strong>Acceptable Use.</strong>&nbsp;You must only use the
                Website and Services for their stated or intended purpose and in
                accordance with this Agreement and all applicable laws and
                regulations. If you acquire POKT tokens (“<strong>POKT</strong>
                ”) through the Website and Services, you agree to acquire POKT
                subject to the Company’s POKT purchase terms and conditions.
              </li>
              <li>
                <strong>Unacceptable Use. </strong>You must not, and must not
                permit any person to:
              </li>
            </ol>
            <div>
                <ol style={{marginLeft: "30px"}}>
                  <li>
                    interfere or violate the legal rights (such as rights of
                    privacy and publicity) of others or violate others’ use or
                    enjoyment of the Websites and Services;
                  </li>
                  <li>
                    attempt to do anything that does or could interfere with,
                    disrupt, negatively affect or inhibit other users from using
                    the Website and Services or links on the Websites or that
                    could damage, disable, overburden or impair the functioning
                    of the Websites, Services or our servers or any networks
                    connected to any of our servers in any manner;
                  </li>
                  <li>
                    create a false identity for the purpose of misleading or
                    deceiving us or others or fraudulently or otherwise
                    misrepresent yourself to be another person or a
                    representative of another entity including, but not limited
                    to, an authorized user of the Websites or our
                    representatives, or fraudulently or otherwise misrepresent
                    that you have an affiliation with a person, entity or group;
                  </li>
                  <li>
                    mislead or deceive us, our representatives and any third
                    parties who may rely on the information provided by you, by
                    providing inaccurate or false information, which includes
                    omissions of information;
                  </li>
                  <li>
                    disguise the origin of any material transmitted via the
                    Websites and Services (whether by forging message/packet
                    headers or otherwise manipulating normal identification
                    information);
                  </li>
                  <li>
                    violate, infringe or misappropriate any intellectual
                    property right of any person (such as copyright, trademarks,
                    patents, or trade secrets, or other proprietary rights of
                    any party) or commit a tort;
                  </li>
                  <li>
                    upload files that contain viruses, Trojan horses, worms,
                    time bombs, cancelbots, corrupted files, or any other
                    similar software or programs that may damage the operation
                    of another’s computer or property;
                  </li>
                  <li>
                    access any content, area or functionality of the Websites
                    and Services that you are prohibited or restricted from
                    accessing or attempt to bypass or circumvent measures
                    employed to prevent or limit your access to any content,
                    area or functionality of the Websites or Services;
                  </li>
                  <li>
                    obtain unauthorized access to or interfere with the
                    performance of the servers which host the Websites and
                    Services or any servers on any associated networks or
                    otherwise fail to comply with any policies or procedures
                    relating to the use of those servers;
                  </li>
                  <li>
                    gain unauthorized access to any services or products, other
                    accounts, computer systems, or networks connected to any of
                    our servers through hacking, password mining, or any other
                    means;
                  </li>
                  <li>
                    obtain any materials or information through any means not
                    intentionally made available through the Websites and
                    Services;
                  </li>
                  <li>
                    harvest or otherwise collect, whether aggregated or
                    otherwise, data about others including email addresses
                    and/or distribute or sell such data in any manner;
                  </li>
                  <li>
                    use any part of the Websites and Services other than for its
                    intended purpose;
                  </li>
                  <li>
                    use any automated means or form of scraping or extracting
                    any data, content or information on the Websites and
                    Services unless it is expressly authorized by us;
                  </li>
                  <li>
                    engage in any act that undermines or compromises the
                    security and integrity of the computer, communication
                    systems, networks, software application, or other computing
                    devices used in connection with the Websites and Services;
                  </li>
                  <li>
                    monitor traffic on the Websites and Services, or permit
                    anyone to do so;
                  </li>
                  <li>
                    engage in or promote any activity that violates this
                    Agreement; and
                  </li>
                  <li>attempt to do any of the foregoing.</li>
                </ol>
              </div>
          </Row>
          <Row>
            <p>
              <u>No Solicitation or Advice</u>
            </p>
            <ol>
              <li>
                <strong>No Offer; No Solicitation.</strong>&nbsp;The information
                and any materials contained in the Websites or Services should
                not be considered as an offer or solicitation to buy or sell
                POKT, provide financial advice, create a trading platform,
                facilitate or take deposits or provide any other financial
                services of any kind in any jurisdiction. Specifically, we
                provide a “Free Tier” wherein users are given limited network
                capacity at no cost. The availability of this service does not
                entitle users to POKT and does not constitute an offer or
                solicitation to purchase POKT.
              </li>
              <li>
                <strong>No Advice.</strong>&nbsp;The information contained on or
                in the Websites and Services is not intended to provide and
                should not be construed as advice of any kind. You shall not use
                the Websites and Services as a substitute for independent and
                competent financial judgement and you should obtain appropriate
                professional advice when necessary.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>General Release</u>
            </p>
            <p>
              To the fullest extent permitted by applicable laws and
              regulations, you release us and our directors, officers, agents,
              representatives, co-branders or other partners, and employees from
              responsibility, liability, claims, demands, and/or damages (actual
              and consequential) of every kind and nature, known and unknown
              (including, but not limited to, claims of negligence), arising out
              of or related to disputes between users and the acts or omissions
              of third parties.
            </p>
            <br></br>
            <p>
              IF YOU ARE A CALIFORNIA RESIDENT, YOU HEREBY WAIVE ANY RIGHTS YOU
              MAY HAVE UNDER CALIFORNIA CIVIL CODE § 1542 WHICH PROVIDES THAT “A
              GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR
              RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER
              FAVOR AT THE TIME OF EXECUTING THE RELEASE AND THAT, IF KNOWN BY
              HIM OR HER, WOULD HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT
              WITH THE DEBTOR OR RELEASED PARTY,” AS WELL AS ANY OTHER STATE OR
              FEDERAL STATUTE OR COMMON LAW PRINCIPLES THAT WOULD OTHERWISE
              LIMIT THE COVERAGE OF THIS RELEASE TO INCLUDE ONLY THOSE CLAIMS
              WHICH YOU MAY KNOW OR SUSPECT TO EXIST IN YOUR FAVOR AT THE TIME
              OF AGREEING TO THIS RELEASE.
            </p>
          </Row>
          <Row>
            <p>
              <u>Miscellaneous</u>
            </p>
            <ol>
              <li>
                <strong>Governing Law.&nbsp;</strong>The validity,
                interpretation, construction and performance of this Agreement,
                and all acts and transactions pursuant hereto and the rights and
                obligations of the parties hereto shall be governed, construed
                and interpreted in accordance with the laws of the state of
                Delaware, without giving effect to principles of conflicts of
                law.
              </li>
              <li>
                <strong>Dispute Resolution Forum.&nbsp;</strong>The courts of
                the state of California, or the federal courts of the United
                States located in California, shall have exclusive jurisdiction
                in the event of any dispute between you and us that arise out of
                or in connection with your access or use of the Website and
                Services.
              </li>
              <li>
                <strong>Right of Modification</strong>. We reserve the right to
                amend this Agreement at any time. You will know if this
                Agreement have changed since the last time you reviewed it by
                checking the “Date of Last Update” section below or in the
                relevant terms of use for any Service. BY CONTINUING TO USE OUR
                WEBSITES AND SERVICES AFTER CHANGES HAVE BEEN POSTED, YOU ARE
                CONFIRMING THAT YOU HAVE READ, UNDERSTOOD AND AGREE TO THE
                LATEST VERSION OF THIS AGREEMENT.
              </li>
              <li>
                <strong>Termination Without Notice.&nbsp;</strong>We may
                terminate this Agreement at any time without notice to you if we
                believe, in our sole discretion, that you have breached, or may
                breach, any term or condition of this Agreement, or for our
                convenience. Termination of this Agreement does not affect
                rights or liabilities, which may have accrued or become due
                prior to the date of termination or the coming into, or
                continuance in, force of any provision which is expressly or by
                implication intended to come into or continue to be in force on
                or after termination.
              </li>
              <li>
                <strong>Rights in General.</strong> We reserve the right,
                without notice and for any reason, to remove any materials from
                the Websites, correct any errors, inaccuracies, or omissions in
                any materials on the Websites, change or update any materials on
                the Websites. We may deny access to, or suspend or terminate use
                of, all or any part of the Website and Services for any user(s)
                at any time and without prior notice, and we reserve the right
                at any time and from time to time to modify or discontinue,
                temporarily or permanently, the Website or Services (or any part
                thereof) with or without notice, unless otherwise indicated in
                an express agreement between you and us. We are not liable to
                you or to any third party for any modification, suspension or
                discontinuance of the Websites or Services.
              </li>
              <li>
                <strong>Suspension.&nbsp;</strong>We may suspend your use of the
                Websites and Services at any time and for any reason, including
                if we have reason to believe that there is likely to be any
                breach of security, or misuse of the Websites or Services, or if
                you breach any of your obligations under this Agreement or the
                Privacy Policy, or for no reason whatsoever.
              </li>
              <li>
                <strong>Severability. </strong>In the event that any provision
                of this Agreement is determined to be unlawful, void or
                unenforceable, such provision shall nonetheless be enforceable
                to the fullest extent permitted by applicable laws and
                regulations, and the unenforceable portion shall be deemed to be
                severed from this Agreement, such determination shall not affect
                the validity and enforceability of any other remaining
                provisions.
              </li>
              <li>
                <strong>No Waiver. </strong>The failure by us to exercise or
                enforce any right or provision of this Agreement does not
                constitute a waiver of our rights, at law or in equity, or a
                waiver of any other provisions or subsequent default by you in
                the performance or compliance with any of this Agreement.
              </li>
              <li>
                <strong>Entire Agreement. </strong>This Agreement and any other
                policies or rules posted by us on the Websites constitute the
                entire agreement and understanding between you and us and govern
                your access and use of the Websites and Services, superseding
                any prior or contemporaneous agreements, communications and
                proposals, whether oral or written, between you and us
                (including, but not limited to, any prior versions of this
                Agreement).
              </li>
              <li>
                <strong>Assignment. </strong>All of our rights and obligations
                under this Agreement are freely assignable by us in connection
                with a merger, acquisition or sale of assets, or by operation of
                law, contract, or otherwise.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>Contact</u>
            </p>
            <p>
              If you have any questions or feedback about this Agreement, please
              contact us at:
            </p>
            <p>
              Pocket Network, Inc.<br/>
              802 E Whiting St<br/>
              Tampa, FL 33602<br/>
              hola@pokt.network<br/>
              <br/>
              Date of Last Update:&nbsp;July 2, 2020
            </p>
            <h1>Testnet Terms of Service</h1>
            <p>
              These Testnet Terms of Service (“<strong>Service Terms</strong>”)
              apply to and govern permitted users’ access to and use of the
              Pocket Core testnet release, services, and tools described
              at&nbsp;
              <a href="https://pokt.network/testnet/">
                https://pokt.network/testnet/
              </a>{" "}
              (the “<strong>Services</strong>” or “<strong>Testnet</strong>”).
              These Service Terms are additional terms that, when you accept,
              form part of the Agreement as defined in the Terms of Use
              published on the Pocket Website (the “
              <strong>Site Terms of Use</strong>”). All terms used herein have
              the meanings defined for them in the Site Terms of Use unless
              otherwise defined herein.
            </p>
          </Row>
          <Row>
            <p>
              <u>Acceptance of Service Terms</u>
            </p>
            <p>
              By using the Testnet, you agree to be bound by these Service Terms
              and the Site Terms of Use. If you do not agree to these Service
              Terms, you shall not access or use the Testnet.
            </p>
          </Row>
          <Row>
            <p>
              <u>General Service Terms</u>
            </p>
            <ol>
              <li>
                <strong>Eligibility.</strong>&nbsp;You must be invited by the
                Company to participate in the Testnet. We limit Testnet
                participation to future application developers and persons
                operating nodes on the Company’s blockchain protocol (the “
                <strong>Pocket Network</strong>”) nodes. We may, at our
                discretion, impose any other eligibility criteria or conditions
                for any Service or any user as we deem appropriate.
                <ol>
                  <li>
                    <strong>License.</strong>&nbsp;You hereby grant us a
                    non-exclusive, royalty-free, worldwide, irrevocable,
                    sub-licensable, and transferrable license to use and display
                    any content, data, information, or materials that you upload
                    or submit to us or to Testnet.
                  </li>
                  <li>
                    <strong>Equipment</strong>. You shall procure your own
                    hardware, software and other resources for accessing and
                    using Testnet. You are responsible for ensuring that your
                    hardware, software and other resources are compatible with
                    the system or software requirements of Testnet and you shall
                    ensure that such equipment will not cause any harm, damage,
                    or threat to the systems, security, and resources of
                    Testnet.
                  </li>
                </ol>
              </li>
              <li>
                <strong>Restrictions.</strong> We reserve the right, in our sole
                discretion and without notice, to block, prevent, or restrict
                any user from using any Service as we deem appropriate. In
                particular, we may block, prevent, suspend, or restrict access
                to and use of any Service by any known or suspected criminals or
                any person from any country that is involved or implicated in
                any sanctions program in any jurisdiction. To the extent
                permitted by laws, we may also adopt any access blocking or
                access restriction mechanisms, such as IP address geo-blocking,
                for any Service as we deem fit or as law requires.
              </li>
              <li>
                <strong>User Identity Verification.</strong> Before we enable
                any user to access or use any Service or as a condition to
                continue use of any Service, we may require any person or
                corporate entity to provide any supporting documents, including
                but not limited to national ID card, passport, and business
                registration certificates. We may also require any person or
                corporate entity to go through such identity authentication,
                verification, or due diligence processes as we deem appropriate.
              </li>
              <li>
                <strong>Warranties</strong>. As the term suggests, the Testnet
                is a network under test and is not the final, mainnet version of
                the Pocket Network. The Testnet is provided to you on an “as is”
                and “as available” basis and all warranties, express, implied,
                statutory or otherwise, with respect to the Service are hereby
                excluded. You understand and acknowledge that the Testnet is in
                test form, may not operate properly, and may contain errors,
                design flaws or other issues. Your use of the Testnet remains at
                your own risk and discretion.
              </li>
              <li>
                <strong>Updates.</strong>&nbsp;We may make any improvement,
                modifications or updates to our Testnet, including but not
                limited to changes and updates to the underlying software,
                infrastructure, security protocols, technical configurations or
                service features (the “<strong>Updates</strong>”) from time to
                time. Your continued access and use of our Testnet are subject
                to such Updates and you shall accept any patches, system
                upgrades, bug fixes, feature modifications, or other maintenance
                work that arise out of such Updates. We are not liable for any
                failure by you to accept and use such Updates in the manner
                specified or required by us.
              </li>
              <li>
                <strong>Termination.</strong>&nbsp;We may suspend or terminate
                the operation of Testnet at any time for any reason. We may also
                wipe, delete or reset the Testnet blockchain or launch a new
                Testnet blockchain any time as we deem appropriate, without
                notice to you. Termination of the Testnet does not affect our
                rights which may have accrued prior to the date of termination
                or the coming into, or continuance in, force of any provision
                which is expressly or by implication intended to come into or
                continue to be in force on or after termination.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>Incentivized Testnet and Rewards</u>
            </p>
            <ol>
              <li>
                <strong>Incentivized Testnet</strong>. We are testing the Pocket
                Network blockchain and making available to Testnet users a
                rewards and incentivization mechanism which mimics the planned
                rewards and incentivization mechanism in the future mainnet
                release (the “<strong>Incentivized Testnet</strong>“). To
                participate in the Incentivized Testnet, you must first obtain
                Testnet tokens (“<strong>Testnet Tokens</strong>”) from the{" "}
                <a href="https://faucet.pokt.network/">faucet</a>, stake Testnet
                Tokens, and connect a Pocket{" "}
                <a href="https://docs.pokt.network/docs/pocket-node-overview">
                  node
                </a>
                &nbsp;or&nbsp;
                <a href="https://docs.pokt.network/docs/developers-overview">
                  application
                </a>{" "}
                (dApp) to the Testnet.
              </li>
              <div>
                <ol style={{marginLeft: "30px"}}>
                  <li>
                    <strong>Temporary in nature.</strong>&nbsp;Testnet Tokens
                    are temporary in nature. Testnet Tokens have no monetary
                    value and cannot be exchanged for cash, cash equivalent, or
                    other tokens or cryptocurrencies.&nbsp;You shall not attach
                    any value to any Testnet Token and you are prohibited from
                    using any Testnet Tokens for any purposes other than to
                    access and use the Testnet.
                  </li>
                  <li>
                    <strong>Cannot trade or sell.</strong> Without limitation,
                    you must not, and must not permit any person to, trade
                    Testnet Tokens with any third party for any purpose, make
                    Testnet Tokens available for trade on any cryptocurrency
                    exchange, offer Testnet Tokens for rent, lease, sale, or
                    trade in any manner, or attempt to do any of the foregoing.
                  </li>
                  <li>
                    <strong>Modification.</strong>&nbsp;We may from time to time
                    add, modify, or remove any feature, functionality, or
                    usability of any Testnet Token. We reserve the right to
                    restart the Testnet and reverse all or some rewards issued,
                    in the case of errors and/or malicious behavior in the
                    system.
                  </li>
                  <li>
                    <strong>Rewards Tokens</strong>. Participants in the
                    Incentivized Testnet will have the opportunity to earn
                    Pocket’s mainnet protocol token, POKT, after mainnet is
                    launched, subject to the conditions below (“
                    <strong>Rewards Tokens</strong>”)
                  </li>
                  <li>
                    <strong>Use Requirement</strong>. All participants who
                    receive Rewards Tokens must use Rewards Tokens on the
                    mainnet Pocket Network as application developers or Pocket
                    Network nodes before they are transferred.
                  </li>
                  <li>
                    <strong>Restricted Wallets</strong>. Rewards Tokens must be
                    used for a minimum of five staking periods following mainnet
                    Pocket Network launch. To enforce this use requirement, the
                    Company will issue Rewards Tokens to restricted digital
                    asset wallets, from which the Company shall not allow
                    transfers until one staking period has elapsed. When Rewards
                    Tokens are released from the restrictions, the digital asset
                    wallets will immediately be fully functional and not subject
                    to any further restrictions.
                  </li>
                </ol>
              </div>
            </ol>
          </Row>
          <Row>
            <p>Date of Last Update:&nbsp;July 8, 2020</p>
          </Row>
          <Row>
            <h1>Boostrap Program Terms of service</h1>
            <p>
              These Infrastructure Bootstrap Program Terms of Service (“
              <strong>Bootstrap Terms</strong>”) apply to and govern permitted
              users’ access to the Website and Services in connection with the
              Company’s Infrastructure Bootstrap Program (as defined below).
              These Bootstrap Terms are additional terms that, when you accept,
              form part of the Agreement as defined in the Terms of Use
              published on the Pocket Website (the “
              <strong>Site Terms of Use</strong>”). All terms used herein have
              the meanings defined for them in the Site Terms of Use unless
              otherwise defined herein.
            </p>
          </Row>
          <Row>
            <p>
              <u>Bootstrap Program</u>
            </p>
            <p>
              The “<strong>Infrastructure Bootstrap Program</strong>” means the
              Company’s program wherein it shall grant POKT tokens (“
              <strong>POKT</strong>”) to certain node operators for the purpose
              of incentivizing early adoption of the Company’s website (URL:
              https://www.pokt.network/) and its subdomains (the “
              <strong>Websites</strong>”) and any products, software, services,
              accounts, and tools provided by us through the Websites (the “
              <strong>Services</strong>”).
            </p>
          </Row>
          <Row>
            <p>
              <u>Acceptance of Bootstrap Terms</u>
            </p>
            <p>
              By accepting, you agree to be bound by these Bootstrap Terms and
              the Site Terms of Use. If you do not agree to these Bootstrap
              Terms, you shall not receive POKT pursuant to the Infrastructure
              Bootstrap Program.
            </p>
          </Row>
          <Row>
            <p>
              <u>General Bootstrap Terms</u>
            </p>
            <ol>
              <li>
                <strong>Eligibility.</strong> You must be invited by the Company
                to participate in the Infrastructure Bootstrap Program. We limit
                Infrastructure Bootstrap Program participation to Pocket Network
                node operators. We may, at our discretion, impose any other
                eligibility criteria or conditions for any Service or any user
                as we deem appropriate.
                <ol>
                  <li>
                    <strong>License.</strong> You hereby grant us a
                    non-exclusive, royalty-free, worldwide, irrevocable,
                    sub-licensable, and transferrable license to use and display
                    any content, data, information, or materials that you upload
                    or submit to us in connection with the Infrastructure
                    Bootstrap Program.
                  </li>
                  <li>
                    <strong>Equipment</strong>. You shall procure your own
                    hardware, software and other resources for accessing and
                    using the Services. You are responsible for ensuring that
                    your hardware, software and other resources are compatible
                    with the system or software requirements of Infrastructure
                    Bootstrap Program and you shall ensure that such equipment
                    will not cause any harm, damage, or threat to the systems,
                    security, and resources of the Services.
                  </li>
                </ol>
              </li>
              <li>
                <strong>Restrictions.</strong>&nbsp;We reserve the right, in our
                sole discretion and without notice, to block, prevent, or
                restrict any user from using any Service as we deem appropriate.
                In particular, we may block, prevent, suspend, or restrict
                access to and use of any Service by any known or suspected
                criminals or any person from any country that is involved or
                implicated in any sanctions program in any jurisdiction. To the
                extent permitted by applicable law, we may also adopt any access
                blocking or access restriction mechanisms, such as IP address
                geo-blocking, for any Service as we deem fit or as applicable
                law requires.
              </li>
              <li>
                <strong>User Identity Verification.</strong>&nbsp;Before we
                enable any user to access or use any Service or as a condition
                to continue use of any Service, we may require any person or
                corporate entity to provide any supporting documents, including
                but not limited to national ID card, passport, and business
                registration certificates. We may also require any person or
                corporate entity to go through such identity authentication,
                verification, or due diligence processes as we deem appropriate.
              </li>
              <li>
                <strong>Updates.</strong>&nbsp;We may make any modifications or
                updates to our Infrastructure Bootstrap Program, including but
                not limited to changes and updates to the terms hereof (the “
                <strong>Updates</strong>”) from time to time. Your continued
                involvement with our Infrastructure Bootstrap Program is subject
                to such Updates and you shall accept any modifications to our
                Infrastructure Bootstrap Program. We are not liable for any
                failure by you to accept and use such Updates in the manner
                specified or required by us.
              </li>
              <li>
                <strong>Termination.</strong>&nbsp;We may suspend or terminate
                the operation of Infrastructure Bootstrap Program at any time
                for any reason, with or without notice. Termination of the
                Infrastructure Bootstrap Program does not affect our rights
                which may have accrued prior to the date of termination or the
                coming into, or continuance in, force of any provision which is
                expressly or by implication intended to come into or continue to
                be in force on or after termination.
              </li>
            </ol>
          </Row>
          <Row>
            <p>
              <u>Infrastructure Bootstrap Program and Rewards</u>
            </p>
            <ol>
              <li>
                <strong>Grant of POKT</strong>. We will grant POKT in increments
                of 15,000 POKT for the sole purpose of operating nodes, and we
                will grant up to an aggregate of 150,000 POKT per each
                applicant, in our sole discretion. For the avoidance of doubt,
                any affiliates shall be deemed the same applicant for purposes
                of the Infrastructure Bootstrap Program. In no event shall any
                applicant be granted more than 150,000 POKT in connection with
                the Infrastructure Bootstrap Program.
              </li>
              <li>
                <strong>Participation Procedures</strong>. To participate in the
                Infrastructure Bootstrap Program, you must first apply online.
                We reserve the right to review your application and conduct due
                diligence, in our sole discretion, including but not limited to
                (i) verifying your technical expertise to connect to and connect
                to and run a Pocket{" "}
                <a href="https://docs.pokt.network/docs/pocket-node-overview">
                  node
                </a>
                , (ii) verify your identity, and (iii) verify your physical
                systems to ensure that such systems are able to connect to and
                run a Pocket{" "}
                <a href="https://docs.pokt.network/docs/pocket-node-overview">
                  node
                </a>
                . Upon completion of our review and approval, we will provide
                you with a digital wallet containing the requisite number of
                POKT as approved by us in our sole discretion.
                <ol>
                  <li>
                    <strong>Cannot trade or sell.</strong> Without limitation,
                    you must not, and must not permit any person to, trade the
                    POKT received in connection with the Infrastructure
                    Bootstrap Program (the “<strong>Bootstrap Tokens</strong>”)
                    with any third party for any purpose, make Bootstrap Tokens
                    available for trade on any cryptocurrency exchange, offer
                    Bootstrap Tokens for rent, lease, sale, or trade in any
                    manner, or attempt to do any of the foregoing.
                  </li>
                  <li>
                    <strong>Restricted Wallets</strong>. To prevent
                    circumvention of the terms of the preceding paragraph, we
                    will issue Bootstrap Tokens to restricted digital asset
                    wallets, from which the we will not allow transfers unless
                    only to a Company owned digital asset wallet for the purpose
                    of returning the Bootstrap Tokens.
                  </li>
                  <li>
                    <strong>Modification.</strong>&nbsp;We may from time to
                    time, in our sole discretion and without notice, add,
                    modify, or remove any feature, functionality, or usability
                    of any Bootstrap Token. We reserve the right to restart the
                    Infrastructure Bootstrap Program and reverse all or some
                    rewards issued, in the case of errors and/or malicious
                    behavior in the system.
                  </li>
                </ol>
              </li>
              <li>
                <strong>Term and Termination</strong>. The Infrastructure
                Bootstrap Program is temporary in nature and intended to last
                only until the Company, in its sole discretion, determines it is
                no longer necessary.
                <ol>
                  <li>
                    <strong>Return of Bootstrap Tokens</strong>. Upon the
                    18-month anniversary of the day we accept your application
                    and provide you the Bootstrap Tokens (the “
                    <strong>Expiration Date</strong>”), you must return the
                    Bootstrap Tokens to a Company digital asset wallet as
                    provided by the Company (the “<strong>Return Wallet</strong>
                    ”). The Bootstrap Tokens will only be permitted to be
                    transferred to a Return Wallet and will otherwise not be
                    transferable to any other digital asset wallet. Should you
                    fail to return your Bootstrap Tokens upon the Expiration
                    Date, we may block, prevent, or restrict you from using any
                    Service as we deem appropriate in our sole discretion.
                  </li>
                </ol>
              </li>
              <li>
                <strong>Rewards Tokens</strong>. By virtue of operating nodes
                using the Bootstrap Tokens, participants in the Infrastructure
                Bootstrap Program will earn POKT (“
                <strong>Earned Tokens</strong>”). The use of the Earned Tokens
                shall not be subject Bootstrap Terms and shall only be subject
                to the Site Terms of Use.
              </li>
            </ol>
          </Row>
          <p>Date of Last Update:&nbsp;July 2, 2020</p>
          <br />
          <span
            className="go top mb-5"
            onClick={() => scrollToId("terms-of-use")}
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
