import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import PropTypes from "prop-types";

// eslint-disable-next-line react/display-name
const LabelToggle = React.forwardRef(({children, onClick}, ref) => (
  <React.Fragment>
    <p style={{marginBottom: 0}}>You are logged in as</p>
    {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
    <a
      style={{color: "black"}}
      href=""
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  </React.Fragment>
));

LabelToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

class LoginStatus extends Component {
  render() {
    const {username} = this.props;

    return (
      <Dropdown>
        <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
          {username}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/logout">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

LoginStatus.propTypes = {
  username: PropTypes.string,
};

export default LoginStatus;
