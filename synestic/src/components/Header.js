import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <nav>
        <div className="logo glitch">
            <Link to="/">synestic</Link>
        </div>
      </nav>
    )
  }
}

export default Header;

