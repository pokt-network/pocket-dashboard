import React, {Component} from "react";
import {Button, Row, Card, Col} from "react-bootstrap";
import "./FreeTier.scss";

class FreeTier extends Component {
  state = {};
  render() {
    return (
      <div id="free-tier">
        <Row>
          <Col>
            <Card className="pl-3 pr-5">
              <Card.Body>
                <h1>Free Tier</h1>
                <ul id="restrictions" className="pl-5 pr-5">
                  <li>
                    Limited to XXX relays <br /> per session
                  </li>
                  <li>
                    Access to AAT, but <br /> not ownership
                  </li>
                  <li>
                    Staked POKT is own by <br /> Pocket Network Inc
                  </li>
                  <li>
                    Unstake balance <br /> unavailable
                  </li>
                </ul>
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <a className="link more" href="#">
                  Learn More
                </a>
              </Card.Body>
            </Card>
            <div className="submit float-right">
              <div>
                <Button variant="dark" size="lg" className=" mt-3">
                  Get free tier
                </Button>
              </div>
              <small>
                By continuing you agree to Pocket&apos;s <br />
                {/*TODO: Add terms and conditions link*/}
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <a className="d-block" href="#">
                  Terms and conditions
                </a>
              </small>
            </div>
          </Col>
        </Row>
        <Row>
          <h3>How it works</h3>
          {/* TODO: Fill with correct information */}
          <p>
            Vivamus magna leo, porta at mauris eget, mattis dapibus felis.
            Phasellus scelerisque ut ligula ac volutpat. Fusce enim augue,
            vestibulum eu leo at, consectetur porta lorem. In placerat viverra
            velit, ut scelerisque est tempus sed. Quisque sit amet porta dolor.
            Nunc lacinia placerat nunc, in malesuada tortor aliquam eget. Morbi
            condimentum et dui et laoreet. Donec egestas lectus in neque
            lobortis aliquam blandit ac nisl. Ut sodales sagittis placerat.
            Aliquam quis massa in massa tincidunt elementum eu sed dolor. Sed
            efficitur tristique nunc. Pellentesque urna lorem, dignissim sed
            fermentum a, condimentum a neque. Phasellus scelerisque risus
            malesuada elit feugiat pharetra. Aliquam vel mauris et nisi
            tristique scelerisque.
          </p>
        </Row>
      </div>
    );
  }
}

export default FreeTier;
