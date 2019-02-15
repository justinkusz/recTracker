import React from 'react';
import { NavLink as RRNavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { attemptLogout, filterRecs } from '../../actions';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Input,
  InputGroup,
  InputGroupAddon,
  NavbarToggler,
  Collapse
} from 'reactstrap';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterName: 'New',
      filter: {
        query: '',
        consumed: false
      },
      navOpen: false,
      filterDropdownOpen: false
    }
  }

  render() {    
    return (
      <Navbar color="dark" dark fixed="top" expand="md">
        <NavbarBrand tag={RRNavLink} style={{outline: 'none'}} to="/">RecTracker</NavbarBrand>
        <NavbarToggler onClick={this.onToggleNavBar} />
        <Collapse isOpen={this.state.navOpen} navbar>
        <Nav navbar className="mr-auto ml-2">
          {this.renderAddRec()}
        </Nav>  
        <Nav navbar className="mx-auto">
            {this.renderConsumedToggle()}
            {this.renderTypeToggle()}
            {this.renderSearch()}
          </Nav>
          {this.renderAuthLinks()}
          </Collapse>
      </Navbar>
    )
  }

  onLogoutClick = () => {
    const token = localStorage.getItem('authToken');
    const user = this.props.user;

    this.props.attemptLogout(user, token);
  }

  toggleFilterDropdown = () => {
    this.setState({
      filterDropdownOpen: !this.state.filterDropdownOpen
    });
  }

  renderConsumedToggle = () => {
    if (!this.props.authenticated || this.props.location.pathname !== '/') {
      return null;
    }

    return (
      <NavItem className="mx-2" style={{width: "100px"}}>
        <Input
          onChange={this.onToggleConsumed}
          defaultValue="new"
          type="select"
          name="consumed">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="old">Old</option>
        </Input>
      </NavItem>
    )
  }

  renderTypeToggle = () => {
    if (!this.props.authenticated || this.props.location.pathname !== '/') {
      return null;
    }

    return (
      <NavItem className="mx-2" style={{width: "110px"}}>
        <Input
          onChange={this.onToggleType}
          defaultValue="all"
          type="select"
          name="type">
          <option value="all">All</option>
          <option value="album">Albums</option>
          <option value="book">Books</option>
          <option value="movie">Movies</option>
          <option value="show">TV Shows</option>
        </Input>
      </NavItem>
    )
  }

  renderSearch = () => {
    if (!this.props.authenticated || this.props.location.pathname !== '/') {
      return null;
    }

    return (
      <NavItem className="mx-2" style={{width: "300px"}}>
        <InputGroup>
          <Input
            type="text"
            name="query"
            placeholder="Search by title/recommender"
            value={this.state.filter.query || this.props.filter.query}
            onChange={this.onChange}
          />
          <InputGroupAddon addonType="append">
            <Button onClick={this.onClearSearch}>clear</Button>
          </InputGroupAddon>
        </InputGroup>
      </NavItem>
    )
  };

  onToggleNavBar = () => {
    this.setState({
      navOpen: !this.state.navOpen
    });
  }

  onToggleType = (event) => {
    var type = event.target.value;

    type = (type === "all") ? undefined : type;

    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        type
      }
    }, () => {
      this.props.filterRecs(this.state.filter);
    });
  }

  onToggleConsumed = (event) => {
    const consumed = (event.target.value === 'old') ? true
      : (event.target.value === 'new') ? false
      : undefined

    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        consumed 
      }
    }, () => {
      this.props.filterRecs(this.state.filter);
    });
  }

  onClearSearch = () => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        query: ''
      }
    }, () => {
      this.props.filterRecs(this.state.filter);
    });
  }

  onChange = (event) => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        [event.target.name]: event.target.value
      }
    }, () => {
      this.props.filterRecs(this.state.filter);
    });
  }

  renderAddRec = () => {
    if (!this.props.authenticated) {
      return null;
    }
    
    if (this.props.location.pathname === '/add-rec') {
      return (
        <NavItem>
          <NavLink tag={RRNavLink} style={{outline: 'none'}} to="/">Cancel</NavLink>
        </NavItem>
      )
    }
    return (
      <NavItem>
        <NavLink tag={RRNavLink} style={{outline: 'none'}} to="/add-rec">Add</NavLink>
      </NavItem>
    )
  }

  renderAuthLinks = () => {
    if (this.props.authenticated) {
      return (
        <Nav navbar className="ml-auto">
          <NavItem>
            <NavLink style={{outline: 'none'}} href="#" onClick={this.onLogoutClick}>Logout</NavLink>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav navbar className="ml-auto">
          <NavItem onClick={this.onToggleNavBar}>
            <NavLink style={{outline: 'none'}} tag={RRNavLink} to="/register">Register</NavLink>
          </NavItem>
          <NavItem onClick={this.onToggleNavBar}>
            <NavLink style={{outline: 'none'}} tag={RRNavLink} to="/login">Login</NavLink>
          </NavItem>
        </Nav>
      )
    }
  }
};

const mapStateToProps = (state) => {
  const { authenticated, user } = state.auth;
  const { filter } = state.recs;

  return { authenticated, user, filter };
}

export default withRouter(connect(mapStateToProps, {
  attemptLogout,
  filterRecs
})(NavBar));