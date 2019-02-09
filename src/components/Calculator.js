import React from 'react'

const Calculator = (props) => {
    const { display, expression } = props.data

        const styles = {    // dynamically change size of font with larger numbers/expressions
            Display: {
                fontSize: display.length < 10 ? 40 : 28
            },
            Expression: {
                fontSize: expression.length < 22 ? 14: 10
            }
        }

    return(
        <div id='calculator'>
            <div id='expression' style={styles.Expression} >{props.data.expression}</div>
            <div id='display' style={styles.Display}>{props.data.display}</div>
            <div id='button-container'>
                <div>
                    <button className='aux' onClick={ props.handleClear } name='clear' id='clear'>AC</button>
                    <button className='aux' onClick={ props.handleNegative } name='negative' value='-' >+/-</button>
                    <button className='aux' onClick={ props.handlePercent } name='percent'>%</button>
                    <button className='operators' onClick={ props.handleOperator } name='operator' value='/' id='divide'>÷</button>
                </div>

                <div>
                    <button className='numbers' onClick={ props.handleNumber } value='7' id='seven'>7</button>
                    <button className='numbers' onClick={ props.handleNumber } value='8' id='eight'>8</button>
                    <button className='numbers' onClick={ props.handleNumber } value='9' id='nine'>9</button>
                    <button className='operators' onClick={ props.handleOperator } name='operator' value='*' id='multiply'>x</button>
                </div>

                <div>
                    <button className='numbers' onClick={ props.handleNumber } value='4' id='four'>4</button>
                    <button className='numbers' onClick={ props.handleNumber } value='5' id='five'>5</button>
                    <button className='numbers' onClick={ props.handleNumber } value='6' id='six'>6</button>
                    <button className='operators' onClick={ props.handleOperator } name='operator' value='-' id='subtract'>-</button>
                </div>

                            
                <div>
                    <button className='numbers' onClick={ props.handleNumber } value='1' id='one'>1</button>
                    <button className='numbers' onClick={ props.handleNumber } value='2' id='two'>2</button>
                    <button className='numbers' onClick={ props.handleNumber } value='3' id='three'>3</button>
                    <button className='operators' onClick={ props.handleOperator } name='operator' value='+' id='add'>+</button>
                </div>

                <div>
                    <button className='numbers' onClick={ props.handleNumber } value='0' id='zero'>0</button>
                    <button className='numbers' onClick={ props.handleDecimal } name='decimal' value='.' id='decimal'>.</button>
                    <button className='operators' onClick={ props.handleEqual } name='equals' id='equals'>=</button>
                </div>
            </div>
        </div>
    )
}

export default Calculator