import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element: Element, PORT }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
          query: ``
        });
        console.log(response.data);
        setIsAuthenticated(response.data.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div>{isAuthenticated ? <Element /> : <Navigate to="/login" />}</div>
  );
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  PORT: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
