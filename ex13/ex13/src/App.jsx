import React from "react";

class Square extends React.Component {
  render() {
    const className = this.props.isWinningSquare ? "square winning" : "square";

    return (
      <button className={className} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(index) {
    return (
      <Square
        value={this.props.squares[index]}
        isWinningSquare={this.props.winningLine.includes(index)}
        onClick={() => this.props.onClick(index)}
      />
    );
  }

  render() {
    return (
      <div className="board" aria-label="OX game board">
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

class Moves extends React.Component {
  render() {
    return (
      <ol className="move-list">
        {this.props.history.map((step, move) => {
          const description = move
            ? `回到第 ${move} 步 (${step.location.row}, ${step.location.col})`
            : "回到遊戲開始";

          return (
            <li key={move}>
              <button
                className={move === this.props.stepNumber ? "move active" : "move"}
                onClick={() => this.props.onJumpTo(move)}
              >
                {description}
              </button>
            </li>
          );
        })}
      </ol>
    );
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: { row: 0, col: 0 }
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(index) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[index]) {
      return;
    }

    squares[index] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares,
          location: {
            row: Math.floor(index / 3) + 1,
            col: (index % 3) + 1
          }
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  resetGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          location: { row: 0, col: 0 }
        }
      ],
      stepNumber: 0,
      xIsNext: true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const isDraw = !result.winner && current.squares.every(Boolean);

    let status;
    if (result.winner) {
      status = `Winner: ${result.winner}`;
    } else if (isDraw) {
      status = "平手";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <main className="app-shell">
        <section className="game">
          <div className="game-board">
            <h1>React OX Game</h1>
            <p className="status">{status}</p>
            <Board
              squares={current.squares}
              winningLine={result.line}
              onClick={(index) => this.handleClick(index)}
            />
            <button className="reset" onClick={() => this.resetGame()}>
              重新開始
            </button>
          </div>
          <div className="game-info">
            <h2>Moves</h2>
            <Moves
              history={history}
              stepNumber={this.state.stepNumber}
              onJumpTo={(step) => this.jumpTo(step)}
            />
          </div>
        </section>
      </main>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }

  return {
    winner: null,
    line: []
  };
}
