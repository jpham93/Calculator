import React, { Component } from 'react';
import './index.css';

import CalculatorContainer from './components/CalculatorContainer'

const App = (props) => {
  return(
    <div id='app'>
      <h1 id='title'>React Calculator</h1>
      <h2 id='subtitle'>Coded and Designed by James Pham</h2>
      <CalculatorContainer />
    </div>
  )
}

export default App