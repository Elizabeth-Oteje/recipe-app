import { Link } from "react-router-dom";
import "./NotFound.css"; // Import the CSS file
import React from "react";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="notfound-link">Go Home</Link>
    </div>
  );
};

export default NotFound;