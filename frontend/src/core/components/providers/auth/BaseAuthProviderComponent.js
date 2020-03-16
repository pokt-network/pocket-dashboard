import React, {Component} from "react";
import queryString from "query-string";
import UserService from "../../../services/UserService";
import {Redirect} from "react-router-dom";
import {HOME_PATH} from "../../../../_routes";

class BaseAuthProviderComponent extends Component {


  constructor(providerName, props, context) {
    super(props, context);

    this.providerName = providerName;
    this.state = {
      authenticated: false
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const {location} = this.props;

    // noinspection JSUnresolvedFunction
    const data = queryString.parse(location.search); // eslint-disable-line react/prop-types

    UserService.loginWithAuthProvider(this.providerName, data.code)
      .then(response => {
        this.setState({
          authenticated: response.success
        });
      });

  }

  render() {
    return (!this.state.authenticated) ? <h6>Authenticating...</h6> : <Redirect to={HOME_PATH}/>;
  }
}

export default BaseAuthProviderComponent;
