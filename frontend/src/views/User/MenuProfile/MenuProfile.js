import React, {Component} from "react";
import {profile} from "../../../_nav";
import MenuItem from "../../../core/components/DefaultLayout/AppSidebar/MenuItem/MenuItem";

class MenuProfile extends Component {
  render() {
    return (
      <ul id="profile-sidebar" className="sidebar-menu">
        {profile.items.map((route, idx) => (
          <MenuItem
            key={idx}
            label={route.name}
            url={route.url}
            icon={route.icon}
          />
        ))}
      </ul>
    );
  }
}

export default MenuProfile;
