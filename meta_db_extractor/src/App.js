import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TopBar from './TopBar.js';
import Content from './Content.js';

class App extends Component {
  render() {
    return (
      <div>
        <TopBar />
        <Content />
      </div>
    );
  }
}

export default App;
