import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  class StartButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: 0,
      };
    }

    render() {
      return (
        <div>
          <p>test{this.state.value}</p>
          <button onClick={() => this.setState({value: this.state.value+1})}>
            up
          </button>
          <button onClick={() => alert('start')}>
            start
          </button>
        </div>
      );
    }
  }

  class Timer extends React.Component {
    render() {
      return (
        <StartButton/>
      );
    }
  }

  class Square extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null,
      };
    }
    render() {
      return (
        <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
      );
    }
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square value={i} />;
    }

    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
          <Timer />
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  // ReactDOM.render(
  //   <h1>Hello, world!</h1>,
  //   document.getElementById('root')
  // );
  