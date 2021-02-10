import React, { Component } from "react";
import { profile } from "../../../_nav";
import MenuItem from "../../../core/components/DefaultLayout/AppSidebar/MenuItem/MenuItem";
import "./ProfileSidebar.scss";
import { isActiveExactUrl } from "../../../_helpers";

class ProfileSidebar extends Component {
  render() {
    return (
      <ul id="profile-sidebar">
        {profile.items.map((route, idx) => (
          <React.Fragment key={idx}>
            <MenuItem
              label={route.name}
              url={route.url}
              icon={route.icon}
              isActive={isActiveExactUrl}
            />
            <hr />
          </React.Fragment>
        ))}
      </ul>
    );
  }
}

export default ProfileSidebar;
