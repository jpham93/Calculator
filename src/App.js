import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Equal, Zero, Signs, Button } from './components/buttons.js';


const Display = (props) => {
  return(
    <div className={props.className}>
      {props.value}
    </div>
  );
}

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      memory: '',
      current: '0',
    };

    this.handleClick = this.handleClick.bind(this);
    this.toMemory = this.toMemory.bind(this);
  }

  handleClick(val){

    if ( val === 'AC' ) {

      this.resetMemory();

    } else if ( val === '=' ) {

      this.compute();
      this.toMemory(val);

    } else {
     
      this.toMemory(val);

    }

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
    let len = memoryCopy.length;

    let result;

    //remove leading division or multiplication sign in any expression 
    if (/^[\*\/]/.test(memoryCopy) ) {

      let memoryEdited = memoryCopy.slice(1, len);
      this.setState({
        memory: memoryEdited,
      });

    }

    //remove last operator from string evaluation
    if ( operators.test(memoryCopy[len - 1]) ) {

      memoryCopy = memoryCopy.slice(0, len - 1);
      result = String(eval(memoryCopy).toPrecision(6));

    } else if ( memoryCopy.includes('=') ) { //if we are computing an expression that's already been evaluated, just return from function
      
      return;

    } else {

      result = String(eval(memoryCopy));

    }

    return result;

  }

  toMemory( choice ) {

    let digits = /[0-9]/;
    let operators = /[X\/\+\-\*]/;
    let equal = /=/;
    let decimal = /\./;

    let currentCopy =  this.state.current.slice();
    let prevChoice = currentCopy[currentCopy.length - 1];

    let memoryCopy = this.state.memory.slice(); 
    let memoryLen = memoryCopy.length;

    let lastZero = /[\+\*\/\-]0$/;

    let memoryFinal;
    let currentFinal;

    //expression for switch case
    const condition = ( c ) => {
      
      if ( digits.test(c) ) {
      
        return 'digits';

      } else if ( operators.test(c)  ) {

        return 'operators';
 
      } else if ( equal.test(c) ) {

        return 'equalSign';

      } else if ( decimal.test(c) ) {

        return 'decimal';

      }

    }

    switch ( condition(choice) ) {

      /////Current seleciton is a digit/////
      case 'digits':  

         //if expression was calculated, start new expression (memory and current)
        if ( memoryCopy.includes('=') ) {

          memoryFinal = choice;
          currentFinal = choice;

        } else { //else, continue off of current expression (memory)

          //if there was no previous action/selection, then simply change 0 to current digit
          if( currentCopy === '0' ) {

            //if current is already 0, we don't let user add additional 0's
            if ( choice === '0' ) {

              return;

            } else if ( lastZero.test(memoryCopy) ) { //if last operand in memory is lone 0, replace leading 0 with digit
              
              let withoutZero = memoryCopy.slice(0,memoryLen - 1);

              memoryFinal = withoutZero + choice;
              currentFinal = choice;

            } else { //otherwise just add to memory

              memoryFinal = memoryCopy.concat( choice );
              currentFinal = choice;

            }

            //if previous selection was a digit other than a lone zero, then concat number to both memory and current
          } else if ( digits.test( prevChoice ) || /\./.test(prevChoice) ) {

            memoryFinal = memoryCopy.concat( choice ),
            currentFinal = currentCopy.concat( choice );

          } else if ( operators.test(prevChoice) ) {

            memoryFinal = memoryCopy.concat(choice);
            currentFinal = choice;

          }

        }  

        break;       

      /////current selection is an operator/////
      case 'operators' :

        let multSign = '*';

        //if expression has been calculated, start new memory with answer
        if ( memoryCopy.includes ('=') ) {

          if ( choice === 'X' ) {

            memoryFinal = currentCopy + multSign;
            currentFinal = choice;

          } else {

            memoryFinal = currentCopy + choice;
            currentFinal = choice;

          }

        } else if ( operators.test( prevChoice ) ) { //if last choice is operator, replace operator in memory and current, not concat

          //modify last position of memory thru copy
          let replacement = memoryCopy.slice(0, memoryCopy.length - 1) + choice;

          if ( choice === 'X' ) {

            replacement = memoryCopy.slice(0, memoryCopy.length - 1) + multSign;
            
          }

          memoryFinal = replacement;
          currentFinal = choice;

        } else { //if expression has not been calculated and last input is not operator then continue adding to memory

          //converts X character into * for expression and memory concactenation
          if ( choice === 'X' ) {
            
              memoryFinal = memoryCopy.concat(multSign);
              currentFinal = choice;
            
          } else {
          
              memoryFinal =  memoryCopy.concat(choice);
              currentFinal = choice;
            
          }

        }

        break;

      /////if choice was equal sign, calculate expression and show answer./////
      case 'equalSign':

        //remove the last operator from showing up in memory
        if ( operators.test( memoryCopy[memoryLen - 1] ) ) {

          memoryCopy = memoryCopy.slice(0, memoryLen - 1);

        }

        let answer = this.compute(); //calculate expression

        if ( !memoryCopy.includes( choice ) ) {
          
            memoryFinal = memoryCopy.concat('=' + answer);
            currentFinal = answer;
        
        }

        break;

      //////for decimal sign//////
      case 'decimal': 

        //allows for only 1 decimal sign per number
        if ( !currentCopy.includes('.') ) {
          
          //adds leading zero for numbers less than 1
          if ( currentCopy === '0' ) {
            
              memoryFinal = memoryCopy + currentCopy + choice;
              currentFinal = currentCopy + choice;
          
          } else if ( operators.test(prevChoice) ) { //adds leading zero if we start new operand with decimal
            
              memoryFinal = memoryCopy.concat('0' + choice);
              currentFinal = 0 + choice;
          
          } else {
            
              memoryFinal = memoryCopy.concat(choice);
              currentFinal = currentCopy.concat(choice)
         
          }

        }

        break;

      default:  // if for some reason none of the conditions are met, exit switch

        break;

    }

    //change state after condition short circuits
    this.setState({
      memory: memoryFinal,
      current: currentFinal,
    });

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
