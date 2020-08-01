import React, {Component} from "react";
import "./PrivacyPolicy.scss";
import {withRouter} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";
import {scrollToId} from "../../_helpers";

class PrivacyPolicy extends Component {
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
            <div className="address center-header">
              <p className="">
                POCKET NETWORK,
                <br />
                INC. PRIVACY POLICY
                <br />
                <span className="address-updated">
                  LAST UPDATED: MAY 18, 2020
                </span>
              </p>
            </div>
          </Row>
          <Row>
            <div className="primary-font-family">
              This privacy policy (“<b>Policy</b>”) describes how Pocket
              Network, Inc. and its related companies (“<b>Company</b>”)
              collect, use and share personal information of consumer users of
              this website, https://pokt.network/ (the “<b>Site</b>”). This
              Policy also applies to any of our other websites that post this
              Policy. This Policy does not apply to websites that post different
              statements.
            </div>
            <br />
          </Row>
          <Row>
            <div>
              <span>WHAT WE COLLECT</span>
              <br />
              <span className="not-bold">
                We get information about you in a range of ways.
              </span>
            </div>
          </Row>
          <Row>
            <div className="information ml-4 top-margin">
              <p>
                <ul>
                  <li className="no-bullet">
                    <span>Information You Give Us.</span>​ We collect your‎
                    name, postal address, email address, phone number, fax
                    number, username, password as well as other information you
                    directly give us on our Site.
                  </li>
                  <li className="no-bullet">
                    <span>Information We Get From Others.</span>​ We may get
                    information about you from other sources. We may add this to
                    information we get from this Site.
                  </li>
                  <li className="no-bullet">
                    <span>Information Automatically Collected.</span> We
                    automatically log information about you and your computer.
                    For example, when visiting our Site, we log your computer
                    operating system type, browser type, browser language, the
                    website you visited before browsing to our Site, pages you
                    viewed, how long you spent on a page, access times and
                    information about your use of and actions on our Site.
                  </li>
                  <li className="no-bullet">
                    <span>Cookies.</span>​ We may log information using
                    &quot;cookies.&quot; Cookies are small data files stored on
                    your hard drive by a website. We may use both session
                    Cookies (which expire once you close your web browser) and
                    persistent Cookies (which stay on your computer until you
                    delete them) to provide you with a more personal and
                    interactive experience on our Site. This type of information
                    is collected to make the Site more useful to you and to
                    tailor the experience with us to meet your special interests
                    and needs.
                  </li>
                </ul>
              </p>
            </div>
          </Row>
          <Row>
            <div className="mt-5">
              <p className="bold justify">USE OF PERSONAL INFORMATION</p>
              <span className="not-bold align-ul">
                We use your personal information as follows:
              </span>
              <ul className="ml-lg-5">
                <li className="no-bullet"></li>
                <li>
                  We use your personal information to operate, maintain, and
                  improve our sites, products, and services.
                </li>
                <li>
                  We use your personal information to respond to comments and
                  questions and provide customer service.
                </li>
                <li>
                  We use your personal information to send information including
                  confirmations, invoices, technical notices, updates, security
                  alerts, and support and administrative messages.
                </li>
                <li>
                  We use your personal information to send information including
                  confirmations, invoices, technical notices, updates, security
                  alerts, and support and administrative messages.
                </li>
                <li>
                  We use your personal information to communicate about
                  promotions, upcoming events, and other news about products and
                  services offered by us and our selected partners.
                </li>
                <li>
                  We use your personal information to link or combine user
                  information with other personal information.
                </li>
                <li>
                  We use your personal information to protect, investigate, and
                  deter against fraudulent, unauthorized, or illegal activity.
                </li>
                <li>
                  We use your personal information to provide and deliver
                  products and services customers request.
                </li>
              </ul>
            </div>
          </Row>
          <Row>
            <div className="information mt-5">
              <p className="bold">SHARING OF PERSONAL INFORMATION</p>
              <span className="not-bold justify align-ul">
                We may share personal information as follows:
              </span>
              <ul className="ml-lg-5">
                <li>
                  We may share personal information with your consent. For
                  example, you may let us share personal information with others
                  for their own marketing uses. Those uses will be subject to
                  their privacy policies.
                </li>
                <li>
                  We may share personal information when we do a business deal,
                  or negotiate a business deal, involving the sale or transfer
                  of all or a part of our business or assets. These deals can
                  include any merger, financing, acquisition, or bankruptcy
                  transaction or proceeding.
                </li>
                <li>
                  We may share personal information for legal, protection, and
                  safety purposes.
                </li>
                <ul>
                  <li>We may share information to comply with laws.</li>
                  <li>
                    We may share information to respond to lawful requests and
                    legal processes.
                  </li>
                  <li>
                    We may share information to protect the rights and property
                    of Pocket Network, Inc., our agents, customers, and others.
                    This includes enforcing our agreements, policies, and terms
                    of use.
                  </li>
                  <li>
                    We may share information in an emergency. This includes
                    protecting the safety of our employees and agents, our
                    customers, or any person.
                  </li>
                </ul>
                <li>
                  We may share information with those who need it to do work for
                  us.
                </li>
                <span className="not-bold justify align-ul-bottom">
                  We may also share aggregated and/or anonymized data with
                  others for their own uses.
                </span>
              </ul>
            </div>
          </Row>
          <Row>
            <div className="information mt-5">
              <span>INFORMATION CHOICES AND CHANGES</span>
              <p>
                Our marketing emails tell you how to “opt-out.” If you opt out,
                we may still send you non-marketing emails. Non-marketing emails
                include emails about your accounts and our business dealings
                with you. You may send requests about personal information to
                our Contact Information below. You can request to change contact
                choices, opt-out of our sharing with others, and update your
                personal information. You can typically remove and reject
                cookies from our Site with your browser settings. Many browsers
                are set to accept cookies until you change your settings. If you
                remove or reject our cookies, it could affect how our Site works
                for you.
              </p>
            </div>
          </Row>
          <Row>
            <div className="information mt-5">
              <span>CONTACT INFORMATION</span>
              <div>
                <p className="not-bold justify">
                  We welcome your comments or questions about this privacy
                  policy. You may also contact us at our address:
                  <br />
                  Pocket Network, Inc.
                  <br />
                  801 E Whiting St
                  <br />
                  Tampa, Florida 33602
                </p>
              </div>
            </div>
          </Row>
          <Row>
            <div className="information mt-5">
              <span>CHANGES TO THIS PRIVACY POLICY</span>
              <p>
                We may change this privacy policy. If we make any changes, we
                will change the Last Updated date above.
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

export default withRouter(PrivacyPolicy);
