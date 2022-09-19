import React from 'react';
import './App.css';
import evaluate from 'evaluator.js';
import {toFixed} from './Voidenotation.js'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      formula: '',
      result: 0,
      prevVal: '0'
    }
    this.handleNumbers = this.handleNumbers.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleOperation = this.handleOperation.bind(this)
    this.calcResult = this.calcResult.bind(this)
    this.handleDecimal = this.handleDecimal.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleKey = this.handleKey.bind(this)    
  }


  handleNumbers(inputValue) {
    //If output is longer then 10 digits
    if(this.state.output.length > 10 && this.state.output !== "DIGIT LIMIT MET" && this.state.output !== "Misused operator") {
        this.setState({
          prevVal: this.state.output,
          output: 'DIGIT LIMIT MET'
        });
        setTimeout(() => this.setState({ output: this.state.prevVal }), 500);
      }
    //If output is less then 10 digits and is valid number
    else if(this.state.output !== "Misused operator") {
      //Initial input or input after result displayed
      if((this.state.output === '0' && (this.state.formula === "" || this.state.formula === "0")) || (/=+/).test(this.state.formula)) {
        this.setState({
          output: inputValue,
          formula: inputValue
        })}
        //If input only numbers so far, add digit to output
        else if((/[1-9.]+/).test(this.state.output)) {
          this.setState({
            output:  this.state.output + inputValue,
            formula: this.state.formula + inputValue
          })}
        //If number is pressed after operator
        else if(this.state.output !== "0" && this.state.output !== "DIGIT LIMIT MET") {
          this.setState({
          output: inputValue,
          formula: this.state.formula + inputValue
          })}
    }
  }

  handleClear() {
    this.setState({
      formula: "",
      output: "0"
    })
  }

  handleOperation(inputValue) {
    //Pressing an operator immediately following = starts a new calculation that operates on the result of the previous evaluation
    if((/=+/).test(this.state.formula)) {
      this.setState({
        output: inputValue,
        formula: this.state.result + inputValue
    })
    }
    //If no numbers are inputed, replace operator with last one pressed
    else if((/[^0-9]+/).test(this.state.output) && (this.state.formula === "" || (/^[-+*/]$/).test(this.state.formula))) {
      this.setState({
        output: inputValue,
        formula: inputValue
      })
    }
    //If operator pressed after number, update display
    else if((/[0-9]+/).test(this.state.output)) {
      this.setState({
        output: inputValue,
        formula: this.state.formula + inputValue
      })
    }
    ////If 2 or more operators are entered consecutively, and last operator entered is negative (-) sign
    else if(inputValue === "-" && (/[/+*-]/).test(this.state.output) && (/[0-9]+[-+*/]$/).test(this.state.formula)) {
      this.setState({
        output: inputValue,
        formula: this.state.formula + inputValue
      })
    }
    ////If 2 or more operators are entered consecutively, the operation considered is the last operator entered (excluding the negative (-) sign)
    else if(inputValue !== "-" && (/[0-9]+[-+*/]$/).test(this.state.formula)) {
      this.setState({
        output: inputValue,
        formula: this.state.formula.replace(/[/*+-]$/, inputValue)
    })}
    //If 2 or more operators are entered consecutively, the operation considered is the last operator entered (excluding the negative (-) sign)
    else if(inputValue !== "-" && (/[0-9]+[+*/][-]$/).test(this.state.formula)) {
      this.setState({
        output: inputValue,
        formula: this.state.formula.replace(/[+*/][-]$/, inputValue)
    })
  }
}

  calcResult(inputValue) {
    //If division by 0
    if((/[0-9]+[/][0]/).test(this.state.formula)) {
      this.setState({
        output: "INFINITY",
        formula: this.state.formula + inputValue + "INFINITY"
      })
    }
    //If input is only operators or if equation beggins with / or *
    else if((/^[*/]./).test(this.state.formula) || (/^[-+*/]$/).test(this.state.formula)) {
      this.setState({
        output: "Misused operator",
        formula: "Misused operator"
      })
    }
    //If equation ends with one operator followed by -, ignore them and proceed with evaluation
    else if((/.[-*+/][-]$/).test(this.state.formula)) {
      this.setState({
        result: toFixed(evaluate(this.state.formula.slice(0,-2)))
        }, () => {
        this.setState({
          output: this.state.result,
          formula: this.state.formula.slice(0,-2) + inputValue + this.state.result
      })})
    }
    //If equation ends with one operator, ignore last one and proceed with evaluation
    else if((/.[-*+/]$/).test(this.state.formula)) {
      this.setState({
        result: toFixed(evaluate(this.state.formula.slice(0,-1)))
        }, () => {
        this.setState({
          output: this.state.result,
          formula: this.state.formula.slice(0,-1) + inputValue + this.state.result
      })})
    }
    //If input is valid and there is not already a result displayed and is not the first command on calculator
    else if(this.state.output !== "Misused operator" && (/^[^=]*$/).test(this.state.formula) && this.state.formula !== "") {
      this.setState({
        result: toFixed(evaluate(this.state.formula))
        }, () => {
        this.setState({
          output: this.state.result,
          formula: this.state.formula + inputValue + this.state.result
      })})
    }
  }
  

  handleDecimal(inputValue) {
    //If there is already a result displayed
    if((/=+/).test(this.state.formula)) {
      this.setState({
        output: '0' + inputValue,
        formula: '0' + inputValue
    })}
    //If it is the first input to calculator or if there is only operators, add 0 before .
    else if((this.state.output === "0" && this.state.formula === "") || (/[-+*/]/).test(this.state.output)) {
      this.setState({
        output: '0' + inputValue,
        formula: this.state.formula + '0' + inputValue
    })}
    //Do not add decimal point if number has one already or if output is error
    else if((/^[^.]*$/).test(this.state.output) && this.state.output !== "Misused operator" && this.state.output !== "DIGIT LIMIT MET") {
    this.setState({
      output: this.state.output + inputValue,
      formula: this.state.formula + inputValue
  })}
  }

handleKey(event) {
  console.log(event.key)
  
  if(event.key === "Enter") {
    const button = document.getElementsByName(event.key);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    const val = "="
    this.calcResult(val);
  }
  if(event.key === ".") {
    const button = document.getElementsByName(event.key);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleDecimal(event.key);
  }
  if((/[-+*/]/.test(event.key))) {
    const button = document.getElementsByName(event.key);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleOperation(event.key);
  }
  if((/[0-9]/.test(event.key))) {
    const button = document.getElementsByName(event.key);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleNumbers(event.key);
  }
  if(event.key === "Delete") {
    const button = document.getElementsByName(event.key);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleClear();
  }
}

handleClick(event) {
  if(event.target.value === "=") {
    const button = document.getElementsByName("Enter");
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.calcResult(event.target.value);
  }
  if(event.target.value === ".") {
    const button = document.getElementsByName(event.target.value);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleDecimal(event.target.value);
  }
  if((/[-+*/]/.test(event.target.value))) {
    const button = document.getElementsByName(event.target.value);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleOperation(event.target.value);
  }
  if((/[0-9]/.test(event.target.value))) {
    const button = document.getElementsByName(event.target.value);
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleNumbers(event.target.value);
  }
  if(event.target.value === "") {
    const button = document.getElementsByName("Delete");
    button[0].classList.add('active')
    setTimeout(() => button[0].classList.remove('active'), 150)
    this.handleClear();
  }
}

componentDidMount() {
  document.addEventListener('keydown', this.handleKey);
}

componentWillUnmount() {
  document.removeEventListener('keydown', this.handleKey);
}
 

  render() {
  return (
    <div className="calculator">
      <header>
        <div id="formula">{this.state.formula}</div>
        <div id="display">{this.state.output}</div>
      </header>
      <main>
        <button id="clear" onClick={this.handleClick} value="" name="Delete">AC</button>
        <button id="divide" onClick={this.handleClick} value="/" name="/">/</button>
        <button id="multiply" onClick={this.handleClick} value="*" name="*">x</button>
        <button id="seven" onClick={this.handleClick} value="7" name="7">7</button>
        <button id="eight" onClick={this.handleClick} value="8" name="8">8</button>
        <button id="nine" onClick={this.handleClick} value="9" name="9">9</button>
        <button id="subtract" onClick={this.handleClick} value="-" name="-">-</button>
        <button id="four" onClick={this.handleClick} value="4" name="4">4</button>
        <button id="five" onClick={this.handleClick} value="5" name="5">5</button>
        <button id="six" onClick={this.handleClick} value="6" name="6">6</button>
        <button id="add" onClick={this.handleClick} value="+" name="+">+</button>
        <button id="one" onClick={this.handleClick} value="1" name="1">1</button>
        <button id="two" onClick={this.handleClick} value="2" name="2">2</button>
        <button id="three" onClick={this.handleClick} value="3" name="3">3</button>
        <button id="equals" onClick={this.handleClick} value="=" name="Enter">=</button>
        <button id="zero" onClick={this.handleClick} value="0" name="0">0</button>
        <button id="decimal" onClick={this.handleClick} value="." name=".">.</button>
      </main>
    </div>
  );
  }
}

export default App;
