import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap'


class Sidebar extends Component {
  render() { 
    return ( 
      <Col xs={2} sm={3} lg={3} id={"sidebar"}>
            <Row>
              <img src={"/logo.png"} alt="logo" id={"main-logo"}/>
            </Row>
            <Row id={"title"}>
              <h1>
                We are <br/>
                pocket <br/>
                network
              </h1>
            </Row>
            <Row>
              <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Pocket Network's mission is to ensure the sustainable <br/>
                Decentralization of blockchain infrastructure. In a <br/>
                market that is over-reliant on single-service provider.
              </p>
            </Row>
          </Col>
     );
  }
}

export default Sidebar;