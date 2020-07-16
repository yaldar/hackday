import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Playlist from './components/Playlist';

const App = () => {
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    if (!cookie.loggedin) {
      setCookie('loggedin', 'no');
    }
    return () => {};
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header"></header>

        {cookie.loggedin === 'no' ? (
          <a href="http://localhost:5000/api/login">click to login</a>
        ) : (
          <Playlist />
        )}

        <Route exact path="/playlist/:access_token">
          <Playlist />
        </Route>
      </div>
    </BrowserRouter>
  );
};

export default App;
