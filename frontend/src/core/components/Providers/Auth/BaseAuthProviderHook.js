import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import UserService from "../../../services/PocketUserService";
import { Redirect } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../_routes";

export class BaseAuthProviderHook extends Component {
  constructor(providerName, props, context) {
    super(props, context);

    this.providerName = providerName;
    this.state = {
      authenticated: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;

    // noinspection JSUnresolvedFunction
    const data = queryString.parse(location.search);

    UserService.loginWithAuthProvider(this.providerName, data.code).then(
      (response) => {
        this.setState({
          authenticated: response.success,
        });
      }
    );
  }

  render() {
    return !this.state.authenticated ? (
      <h6>Authenticating...</h6>
    ) : (
      <Redirect to={ROUTE_PATHS.home} />
    );
  }
}

BaseAuthProviderHook.propTypes = {
  location: PropTypes.object,
};
