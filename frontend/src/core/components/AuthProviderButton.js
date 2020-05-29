import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import UserService from "../services/PocketUserService";

export const AuthProviderType = {
  login: "Login",
  signup: "Sign up",
};

export class AuthProviderButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(e) {
    const {consent_url} = this.props.authProvider;

    UserService.showWelcomeMessage(true);

    window.open(consent_url, "_parent");
  }

  render() {
    const {block, icon, className, authProvider, type} = this.props;

    return (
      <Button
        variant="dark"
        className={className}
        size={"lg"}
        block={block}
        onClick={this.onButtonClick}
      >
        {icon ? <img alt="" src={`/assets/${authProvider.name}.svg`} /> : null} {type} with{" "}
        {authProvider.name.slice(0, 1).toUpperCase() +
          authProvider.name.slice(1, authProvider.name.length)}
      </Button>
    );
  }
}

AuthProviderButton.defaultProps = {
  block: true,
  className: "rounded-pill",
  authProvider: {
    name: "",
    consent_url: "",
  },
};

AuthProviderButton.propTypes = {
  block: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.object,
  authProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    consent_url: PropTypes.string.isRequired,
  }),
};
