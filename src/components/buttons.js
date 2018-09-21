import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/***Too unweildy for styling***/
//Special Buttons
const Equal = (props) => {
  return(
    <button id='equal' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const Zero = (props) => {
  return(
    <button id='zero' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const Signs = (props) => {
  return(
    <button className='signs' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const Button = (props) => {
  return(
    <button id={props.value} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export {Equal, Zero, Signs, Button} ;