import React, {Component} from "react";
import {profile} from "../../../_nav";
import MenuItem from "../../../core/components/DefaultLayout/AppSidebar/MenuItem/MenuItem";
import "./ProfileSidebar.scss";
import {isActiveExactUrl} from "../../../_helpers";

class ProfileSidebar extends Component {
  render() {
    return (
      <ul id="profile-sidebar" className="sidebar-menu">
        {profile.items.map((route, idx) => (
          <MenuItem
            key={idx}
            label={route.name}
            url={route.url}
            icon={route.icon}
            isActive={isActiveExactUrl}
          />
        ))}
      </ul>
    );
  }
}

export default ProfileSidebar;
