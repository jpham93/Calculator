import React, { Component } from 'react'
import Calculator from './Calculator'

const opSet = /[\/\+\-\*]/

class CalculatorContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display: '0',
            expression: '0',
        }
    }   

    calculate = () => {
        let { expression, display } = this.state

        if(opSet.test( expression[expression.length - 1] ))
            expression = expression.slice(0, expression.length - 1)

        if( expression.includes('=') )  // if expression already solved, just return what is stored in display
            expression = display            

        let result = eval(expression)  // remove trailing operator before calculating

        this.setState( () => ({
            display: `${result}`,
            expression: `${expression}=${result}`,
        }) )
    }

    handleNumber = (event) => {
        const { value } = event.target
        const { display, expression } = this.state
        let newExpr
        let newDisplay

        if( this.state.expression.includes('=') )   // reset expression if selecting a number after expression is calculated
        {
            newDisplay = value
            newExpr = value
        }
        else if(value === '0')
        {
            newDisplay = display === '0' ? '0' : display + value
            newExpr =  display === '0' ? expression : expression + value
        }
        else if( opSet.test(display) )
        {   
            newDisplay = value
            newExpr = expression + value
        }
        else    // adding numbers other than zero
        {   
            newDisplay = display === '0' ? value :  display + value     // replace lone 0 with new value
            newExpr = expression === '0' ? value : expression + value   // same with expression
        }
        this.setState({
            display: newDisplay,
            expression: newExpr,
        })
    }

    handleDecimal = (event) => {
        const { value } = event.target
        const { display, expression } = this.state

        if( expression.includes('=') )  // if expression is finished and decimal selected, add
        {
            this.setState({
                display: '0' + value,
                expression: '0' + value,
            })
        }
        else if( opSet.test(display) )
        {
            this.setState( (prevState) => ({
                display: '0' + value,
                expression: prevState.expression + '0' + value,
            }) )
        }
        else
        {
            display.includes('.')
            ? null  // if current number has decimal, do not add another decimal
            : this.setState( (prevState) => ({
                display: prevState.display + value,
                expression: prevState.expression + value,
            }) )
        }
    }

    handleOperator = (event) => {
        const { value } = event.target
        const { display, expression } = this.state
        let newDisplay = value 
        let newExpr = opSet.test(display)   // remove trailing operator if operator is selected again
        ? expression.slice(0, expression.length - 1) + value
        : expression + value

        if( expression.includes('=') )
        {
            newExpr = display + value 
            console.log(display)
        }

        this.setState( () => ({
            display: newDisplay,
            expression: newExpr,
        }) )
    }   

    handlePercent = () => {
        const { display } = this.state

        if( !opSet.test(display) )
        {
            this.calculate()    // calculate then give percent. 
            this.setState( () => {
                let newDisplay = new String( display / 100 )
                return {
                    display: newDisplay,
                    expression: newDisplay,
                }
            })
        }
    }

    handleNegative = () => {
        this.calculate()  // calculate first, then change sign of number
        const { display, expression } = this.state
        let newDisplay = new String(display * (-1))
        this.setState({
            display: newDisplay,
            expression: newDisplay,
        })
    }

    handleClear = () => {
        this.setState( () => ({
            display: '0',
            expression: '0',
        }) )
    }

    render() {
        return(
            <div>
                <Calculator 
                    data={ this.state }
                    handleNumber={ this.handleNumber }
                    handleDecimal={ this.handleDecimal }
                    handleOperator={ this.handleOperator }
                    handlePercent={ this.handlePercent }
                    handleNegative={ this.handleNegative }
                    handleEqual={ this.calculate }
                    handleClear={ this.handleClear }
                />
            </div>
        )
    }
}

export default CalculatorContainer