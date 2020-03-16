import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class AuthProviderButton extends Component {


  constructor(props, context) {
    super(props, context);

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(e) {
    const {consent_url} = this.props.authProvider;

    window.open(consent_url, "_parent");
  }

  render() {
    const {block, icon, className, authProvider} = this.props;
    return (
      <Button variant="outline-secondary" className={className} size={"lg"} block={block} onClick={this.onButtonClick}>
        {icon ? <FontAwesomeIcon icon={icon}/> : null} Login with {authProvider.name}
      </Button>
    );
  }
}

AuthProviderButton.defaultProps = {
  block: true,
  className: "rounded-pill",
  authProvider: {
    name: "",
    consent_url: ""
  }
};

AuthProviderButton.propTypes = {
  block: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.object,
  authProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    consent_url: PropTypes.string.isRequired
  })
};
