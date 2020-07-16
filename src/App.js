import './App.css';
import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { CookiesProvider, withCookies, useCookies } from 'react-cookie';
import Login from './components/Login.jsx';

const App = () => {
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    if (!cookie.loggedin) {
      setCookie('loggedin', 'no');
    }
    return () => {};
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      {cookie.loggedin === 'no' ? <Login className="login" /> : null}
    </div>
  );
};

export default App;
