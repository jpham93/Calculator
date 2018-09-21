import React, { Component } from 'react';


const Display = (props) => {
  return(
    <div className={props.className}>
      {props.value}
    </div>
  );
}

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

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      memory: '',
      current: '0',
    };
  }

  handleClick(val){

    if(val === 'AC')
      this.resetMemory();

    else if(val === '='){
      this.compute();
      this.toMemory(val);
    }

    else
      this.toMemory(val);

  }

  ////SUPPORTING METHODS////
  resetMemory(){

    this.setState({
      memory: '',
      current: '0',
    });

  }

  compute(){

    let operators = /[\+\-\*\/]/

    let memoryCopy = this.state.memory.slice();
    let len = memoryCopy.length

    let result;

    //remove last operator from string evaluation
    if(operators.test(memoryCopy[len - 1])){
      memoryCopy = memoryCopy.slice(0, len - 1);
      result = String(eval(memoryCopy).toPrecision(6));
    }

    //if we are computing an expression that's already been evaluated,
    //just return from function
    else if(memoryCopy.includes('=')){
      return;
    }

    else{
      result = String(eval(memoryCopy));
    }

    return result;

  }


  toMemory(choice){

    let digits = /[0-9]/;
    let operators = /[X\/\+\-\*]/;
    let equal = /=/;
    let decimal = /\./;

    let currentCopy = this.state.current.slice();
    let prevChoice = currentCopy[currentCopy.length - 1];

    let memoryCopy = this.state.memory.slice();
    let memoryLen = memoryCopy.length

    let lastZero = /[\+\*\/\-]0$/


    /////Current seleciton is a digit/////
    if(digits.test(choice)){

      //if expression was calculated, start new expression (memory and current)
      if(memoryCopy.includes('=')){

        this.setState({
          memory: choice,
          current: choice
        });

      }

      //else, continue off of current expression (memory)
      else{

        //if there was no previous action/selection, then simply change 0 to current digit
        if(currentCopy === '0'){
          //if current is already 0, we don't let user add additional 0's
          if(choice === '0')
            return;

          //if last operand in memory is lone 0, replace leading 0 with digit
          else if(lastZero.test(memoryCopy)){
            let withoutZero = memoryCopy.slice(0,memoryLen - 1);

            this.setState({
              memory: withoutZero + choice,
              current: choice
            });
          }

          else{
            this.setState({
              memory: memoryCopy.concat(choice),
              current: choice
            });
          }
        }

        //if previous selection was a digit other than a lone zero, then concat number to both memory and current
        else if(digits.test(prevChoice) || /\./.test(prevChoice)){

          this.setState({
            memory: memoryCopy.concat(choice),
            current: currentCopy.concat(choice)
          });

        }

        //if previous selection was an operator, reset current to digit. Concat to memory normally
        else if(operators.test(prevChoice)){
          this.setState({
            memory: memoryCopy.concat(choice),
            current: choice
          });
        }

      }

    }

    /////current selection is an operator/////
    else if(operators.test(choice)){

      let multSign = '*';

      //if expression has been calculated, start new memory with answer
      if(memoryCopy.includes('=')){

        if(choice === 'X'){
          this.setState({
            memory: currentCopy + multSign,
            current: choice
          });
        }

        else{
          this.setState({
            memory: currentCopy + choice,
            current: choice
          });
        }
      }

      //if last choice is operator, replace operator in memory and current, not concat
      else if(operators.test(prevChoice)){

        //modify last position of memory thru copy
        let replacement = memoryCopy.slice(0, memoryCopy.length - 1) + choice;

        if(choice === 'X'){
          replacement = memoryCopy.slice(0, memoryCopy.length - 1) + multSign;
        }

        this.setState({
          memory: replacement,
          current: choice
        });
      }

      //if expression has not been calculated and last input is not operator then continue adding to memory
      else{

        //converts X character into * for expression and memory concactenation
        if(choice == 'X'){
          this.setState({
            memory: this.state.memory.concat(multSign),
            current: choice
          });
        }

        else{
          this.setState({
            memory: this.state.memory.concat(choice),
            current: choice
          });
        }

      }

    }

    /////if choice was equal sign, calculate expression and show answer./////
    else if(equal.test(choice)){

       //remove the last operator from showing up in memory
       if(operators.test(memoryCopy[memoryLen - 1])){
         memoryCopy = memoryCopy.slice(0, memoryLen - 1);
       }

      let answer = this.compute();

      if(!memoryCopy.includes(choice)){
        this.setState({
          memory: memoryCopy.concat('=' + answer),
          current: answer
        });
      }

    }

    //////for decimal sign//////
    else{

      //allows for only 1 decimal sign per number
      if(!currentCopy.includes('.'))
      {
        //adds leading zero for numbers less than 1
        if(currentCopy === '0'){
          this.setState({
            memory: memoryCopy + currentCopy + choice,
            current: currentCopy + choice
          });
        }

        //adds leading zero if we start new operand with decimal
        else if(operators.test(prevChoice)){
          this.setState({
            memory: memoryCopy.concat('0' + choice),
            current: 0 + choice
          })
        }

        else{
          this.setState({
            memory: memoryCopy.concat(choice),
            current: currentCopy.concat(choice)
          });
        }
      }
    }

  }

  //Methods to render child components
  renderDisplay(){
    return(
      <div className='row'>
        <Display value={this.state.memory} className='memory' />
        <Display value={this.state.current} className='current' />
      </div>
    );
  }

  renderButton(val){
    if(val==='='){
      return(
        <Equal value={val} onClick={() => this.handleClick(val)} />
      );
    }

    else if(val==='0'){
      return(
        <Zero value={val} onClick={() => this.handleClick(val)} />
      );
    }

    else if(/[X\/\+\-]/.test(val)){
      return(
        <Signs value={val} onClick={() => this.handleClick(val)} />
      );
    }

    else{
      return(
        <Button className='Button' value={val} onClick={() => this.handleClick(val)} />
      );
    }
  }

  render(){
    return(

      <div className='App'>

        <h1 className='title'>
          Designed and Coded By James Pham
        </h1>

        <div className='Calculator'>

          <div className='row'>
            {this.renderDisplay()}
          </div>

          <div className='row'>
            {this.renderButton('AC')}
            {this.renderButton('/')}
            {this.renderButton('X')}
          </div>

          <div className='row'>
            {this.renderButton('7')}
            {this.renderButton('8')}
            {this.renderButton('9')}
            {this.renderButton('-')}
          </div>

          <div className='row'>
            {this.renderButton('4')}
            {this.renderButton('5')}
            {this.renderButton('6')}
            {this.renderButton('+')}
          </div>

          <div className='double-row'>
            {this.renderButton('1')}
            {this.renderButton('2')}
            {this.renderButton('3')}
            {this.renderButton('=')}
          </div>

          <div className='bottom-row'>
            {this.renderButton('0')}
            {this.renderButton('.')}
          </div>

        </div>

      </div>
    );
  }
}

export default App;

/**
  Logical function deciding action on current value:
  - helps decide if button is digit, operator, decimal, or clear
  - Digit
    --> if current == 0, replace 0 with new digit if new digit !== 0
    --> if current != 0, concat digit to current value
    --> Decimal acts as digit. only allow decimal choice once.
  - Operator
    --> operator ends digit expansion and concats current value to memory with new operator
    --> the last operator choice will be kept in current and change in memory in real time
    --> after a new digit/decimal, operator is committed to memory
  - Equals
    --> sets current equal to result. Result is also added to the end of memory ex. 3 + 3 = 6
    --> if operator is chosen after '=', then last result starts beginning of new memory
    --> if digit, memory starts over.
  - AC
    --> sets memory and current to 0
*/
