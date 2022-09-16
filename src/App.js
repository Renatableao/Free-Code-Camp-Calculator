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
    
  }


  handleNumbers(event) {
    if(this.state.output.length > 10 && this.state.output !== "DIGIT LIMIT MET") {
        this.setState({
          prevVal: this.state.output,
          output: 'DIGIT LIMIT MET'
        });
        setTimeout(() => this.setState({ output: this.state.prevVal }), 500);
      }
      
    else {
      if((this.state.output === '0' && (this.state.formula === "" || this.state.formula === "0")) || (/=+/).test(this.state.formula)) {
        this.setState({
          output: event.target.value,
          formula: event.target.value
        })}
        else if((/[1-9]+/).test(this.state.output)) {
          this.setState({
            output:  this.state.output + event.target.value,
            formula: this.state.formula + event.target.value
          })}
        else if(this.state.output !== "0" && this.state.output !== "DIGIT LIMIT MET") {
          this.setState({
          output:  event.target.value,
          formula: this.state.formula + event.target.value
          })}
    }
  }

  handleClear() {
    this.setState({
      formula: "",
      output: "0"
    })
  }

  handleOperation(event) {
    if((/=+/).test(this.state.formula)) {
      console.log(this.state.result)
      this.setState({
        output: event.target.value,
        formula: this.state.result + event.target.value
    })
    }
    else if((/[^0-9]+/).test(this.state.output) && (this.state.formula === "" || (/^[-+*/]$/).test(this.state.formula))) {
      this.setState({
        output: event.target.value,
        formula: event.target.value
      })
    }
    else if((/[0-9]+/).test(this.state.output)) {
      this.setState({
        output: event.target.value,
        formula: this.state.formula + event.target.value
      })
    }
    else if(event.target.value === "-" && (/[/+*-]/).test(this.state.output) && (/[0-9]+[-+*/]$/).test(this.state.formula)) {
      this.setState({
        output: event.target.value,
        formula: this.state.formula + event.target.value
      })
    }
    else if(event.target.value !== "-" && (/[0-9]+[-+*/]$/).test(this.state.formula)) {
      this.setState({
        output: event.target.value,
        formula: this.state.formula.replace(/[/*+-]$/, event.target.value)
    })}
    else if(event.target.value !== "-" && (/[0-9]+[+*/][-]$/).test(this.state.formula)) {
      this.setState({
        output: event.target.value,
        formula: this.state.formula.replace(/[+*/][-]$/, event.target.value)
    })
  }
}

  calcResult(event) {
    //If division by 0
    if((/[0-9]+[/][0]/).test(this.state.formula)) {
      this.setState({
        output: "INFINITY",
        formula: this.state.formula + event.target.value + "INFINITY"
      })
    }
    else if((/^[0-9]+[-*+/]$/).test(this.state.formula)) {
      this.setState({
        output: this.state.formula.slice(0,-1),
        formula: this.state.formula.slice(0,-1) + event.target.value + this.state.formula.slice(0,-1)
      })
    }
    else {
    this.setState({
      result: toFixed(evaluate(this.state.formula))
  }, () => {
      this.setState({
        output: this.state.result,
        formula: this.state.formula + event.target.value + this.state.result
      })})
    }
  }
  

  handleDecimal(event) {
    //If there is already a result displayed
    if((/=+/).test(this.state.formula)) {
      this.setState({
        output: '0' + event.target.value,
        formula: '0' + event.target.value
    })}
    //If it is the first input to calculator or if there is only operators, add 0 before .
    else if((this.state.output === "0" && this.state.formula === "") || (/[-+*/]/).test(this.state.output)) {
      this.setState({
        output: '0' + event.target.value,
        formula: this.state.formula + '0' + event.target.value
    })}
    //Do not add decimal point if number has one already
    else if((/^[^.]*$/).test(this.state.output)) {
    this.setState({
      output: this.state.output + event.target.value,
      formula: this.state.formula + event.target.value
  })}
  }
 

  render() {
  return (
    <div className="calculator">
      <header>
        <div id="formula">{this.state.formula}</div>
        <div id="display">{this.state.output}</div>
      </header>
      <main>
        <button id="clear" onClick={this.handleClear} value="">AC</button>
        <button id="divide" onClick={this.handleOperation} value="/">/</button>
        <button id="multiply" onClick={this.handleOperation} value="*">*</button>
        <button id="seven" onClick={this.handleNumbers} value="7">7</button>
        <button id="eight" onClick={this.handleNumbers} value="8">8</button>
        <button id="nine" onClick={this.handleNumbers} value="9">9</button>
        <button id="subtract" onClick={this.handleOperation} value="-">-</button>
        <button id="four" onClick={this.handleNumbers} value="4">4</button>
        <button id="five" onClick={this.handleNumbers} value="5">5</button>
        <button id="six" onClick={this.handleNumbers} value="6">6</button>
        <button id="add" onClick={this.handleOperation} value="+">+</button>
        <button id="one" onClick={this.handleNumbers} value="1">1</button>
        <button id="two" onClick={this.handleNumbers} value="2">2</button>
        <button id="three" onClick={this.handleNumbers} value="3">3</button>
        <button id="equals" onClick={this.calcResult} value="=">=</button>
        <button id="zero" onClick={this.handleNumbers} value="0">0</button>
        <button id="decimal" onClick={this.handleDecimal} value=".">.</button>
      </main>
    </div>
  );
  }
}

export default App;
