import React, { Component } from 'react';


class Navbar extends Component {

  render() {
    return (
      <nav className ="navbar navbar-dark bg-dark box-shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0 text-white" >

          <img src = {require('../images/LegitHub.png')}  max-height =  "40px" max-width =  "30%" alt=""/>

        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white" ><span id="account" >{this.props.account}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;