import React from "react";
import { NavLink as RRNavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { attemptLogout } from "../../actions";
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse
} from "reactstrap";

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navOpen: false
    };
  }

  render() {
    return (
      <Navbar color="dark" dark fixed="top">
        <NavbarBrand tag={RRNavLink} style={{ outline: "none" }} to="/">
          RecTracker
        </NavbarBrand>
        {this.renderAddRec()}
        {this.renderAuthLinks()}
      </Navbar>
    );
  }

  onLogoutClick = () => {
    const token = localStorage.getItem("authToken");
    const user = this.props.user;

    this.props.attemptLogout(user, token);
  };

  renderAddRec = () => {
    if (!this.props.authenticated) {
      return null;
    }

    if (this.props.location.pathname === "/add-rec") {
      return (
        <NavItem>
          <NavLink tag={RRNavLink} style={{ outline: "none" }} to="/">
            Cancel
          </NavLink>
        </NavItem>
      );
    }
    return (
      <NavItem>
        <NavLink tag={RRNavLink} style={{ outline: "none" }} to="/add-rec">
          Add rec
        </NavLink>
      </NavItem>
    );
  };

  renderAuthLinks = () => {
    if (this.props.authenticated) {
      return (
        <Nav className="ml-auto">
          <NavLink
            style={{ outline: "none" }}
            href="#"
            onClick={this.onLogoutClick}
          >
            Logout
          </NavLink>
        </Nav>
      );
    } else {
      return (
        <Nav className="ml-auto">
          <NavLink style={{ outline: "none" }} tag={RRNavLink} to="/register">
            Register
          </NavLink>
          <NavLink style={{ outline: "none" }} tag={RRNavLink} to="/login">
            Login
          </NavLink>
        </Nav>
      );
    }
  };
}

const mapStateToProps = state => {
  const { authenticated, user } = state.auth;

  return { authenticated, user };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      attemptLogout
    }
  )(NavBar)
);
