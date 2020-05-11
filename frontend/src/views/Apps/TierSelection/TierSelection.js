import React, {Component} from "react";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import ApplicationService from "../../../core/services/PocketApplicationService";
import "./TierSelection.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";

class TierSelection extends Component {
  constructor(props, context) {
    super(props, context);

    this.createFreeTierItem = this.createFreeTierItem.bind(this);

    this.state = {
      freeTierModal: false,
      customTierModal: false,
    };
  }

  async createFreeTierItem() {
    const {address, chains} = ApplicationService.getAppAInfo();

    const data = await ApplicationService.stakeFreeTierApplication(
      address, chains
    );

    // TODO: Notify of errors on the frontend
    if (data !== false) {
      // eslint-disable-next-line react/prop-types
      this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.appCreated));
    }
  }

  render() {
    const {freeTierModal, customTierModal} = this.state;

    return (
      <div id="tier-selection" className="mt-4 ml-5">
        <Row>
          <Col id="titles">
            <h1>Choose what is more convenient for your app</h1>
            <p>Connect your app to any blockchain with our free tier</p>
          </Col>
        </Row>
        <Row>
          <Col lg={{span: 4, offset: 2}}>
            <Card className="tier-card mr-5">
              <Card.Body>
                <h2>Free tier</h2>
                <p>Limited to XXX relays per session</p>
                <p>Access to AAT, but not ownership</p>
                <p>Staked POKT is own by Pocket Network Inc</p>
                <p>Unstake balance unavailable</p>
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <Button
                  onClick={() => this.setState({freeTierModal: true})}
                  variant="link"
                  className="link cta"
                >
                  How it works
                </Button>
                <br />
                <Button
                  onClick={() => this.createFreeTierItem()}
                  size="lg"
                  variant="dark"
                  className="pr-5 pl-5 mt-3"
                >
                  Get Free Tier
                </Button>
                <br />
                <small>By getting free tier you agree to Pocket&apos;s</small>
                <small>
                  {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                  <a className="link" href="#">
                    Terms and conditions
                  </a>
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={{span: 4}} className="right-tier">
            <Card className="tier-card mr-5">
              <Card.Body>
                <h2 className="custom-tier-title">Custom tier</h2>
                <p>Custom amount of relays</p>
                <p>ATT ownership</p>
                <p>Staked POKT is own by the user</p>
                <p>Unstake balance available for transfers</p>
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <Button
                  onClick={() => this.setState({customTierModal: true})}
                  variant="link"
                  className="link cta"
                >
                  Learn more
                </Button>
                <br />
                <Link to={_getDashboardPath(DASHBOARD_PATHS.selectRelays)}>
                  <Button size="lg" variant="dark" className="pr-5 pl-5 mt-3">
                    Customize your tier
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          className="app-modal"
          show={freeTierModal}
          onHide={() => this.setState({freeTierModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>How the free tier works?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum
            fusce ut placerat orci nulla pellentesque dignissim enim. Semper
            quis lectus nulla at volutpat diam ut. Sed velit dignissim sodales
            ut. Cursus euismod quis viverra nibh cras. Diam sollicitudin tempor
            id eu nisl nunc mi ipsum. Tortor condimentum lacinia quis vel.
            Cursus eget nunc scelerisque viverra mauris in aliquam sem.
            Tincidunt arcu non sodales neque sodales ut etiam sit amet. Id eu
            nisl nunc mi ipsum faucibus vitae aliquet.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="dark"
              className="pr-4 pl-4"
              onClick={() => this.setState({freeTierModal: false})}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="app-modal"
          show={customTierModal}
          onHide={() => this.setState({customTierModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Run actually desentralized infrastructure</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Odio facilisis mauris sit amet massa. Urna porttitor rhoncus dolor
            purus non enim praesent elementum facilisis. Ac tincidunt vitae
            semper quis. Tellus cras adipiscing enim eu turpis egestas pretium.
            Nulla at volutpat diam ut venenatis. Viverra nam libero justo
            laoreet. Risus nullam eget felis eget nunc. Tincidunt id aliquet
            risus feugiat. Sed risus ultricies tristique nulla aliquet.
            Habitasse platea dictumst vestibulum rhoncus est pellentesque elit
            ullamcorper dignissim. Egestas sed tempus urna et pharetra pharetra
            massa. Accumsan in nisl nisi scelerisque eu ultrices vitae.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="dark"
              className="pr-4 pl-4"
              onClick={() => this.setState({customTierModal: false})}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default TierSelection;
