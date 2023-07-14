import React, { Component } from 'react';
import './Navbar.css';


class Navbar extends Component {
  render() {
    return (
      <nav className="PathfindingVisualizer__navbar">
        <ul className="PathfindingVisualizer__navbar-container">
          <li className="PathfindingVisualizer__navbar-item">
            {this.props.children}
            </li>
          <li className='PathfindingVisualizer__navbar-item-dropdown'>
            {this.props.dropdown}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
