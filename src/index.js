import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function ToggleLetter(props) {
    return (
        <button onClick={props.onClick}>
            Change
        </button>
    );
}

function checkSOS(row, column, squares) {
    const lines = [
        [row, column, row, column+1, row, column+2],
        [row, column, row+1, column, row+2, column],
        [row, column, row+1, column+1, row+2, column+2],
        [row, column, row-1, column+1, row-2, column+2],

        [row, column-1, row, column, row, column+1],
        [row-1, column, row, column, row+1, column],
        [row-1, column-1, row, column, row+1, column+1],
        [row-1, column+1, row, column, row+1, column-1],

        [row, column-2, row, column-1, row, column],
        [row-2, column, row-1, column, row, column],
        [row-2, column-2, row-1, column-1, row, column],
        [row+2, column-2, row+1, column-1, row, column],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [ar, ac, br, bc, cr, cc] = lines[i];
        
        console.log('ar:' + ar + ' ac:' + ac + ' br:' + br + ' bc:' + bc + ' cr:' + cr + ' cc:' + cc);
        
        if (squares[ar][ac] === 'S' && squares[br][bc] === 'O' && squares[cr][cc] === 'S') {
            console.log('Scores');
        }
    }
    return null;
    
}

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(18).fill(null).map(x => Array(18).fill(null)),
            xIsNext: true
        };
    }

    handleSquareClick(i, j) {
        const squares = this.state.squares.slice();
        if (squares[i][j] == null) {
            squares[i][j] = this.state.xIsNext ? 'S' : 'O';
            this.setState({
                squares: squares,
            });
        }
        checkSOS(i, j, squares)
    }

    renderSquare(i, j) {
        return (
            <Square
                value={this.state.squares[i][j]}
                onClick={() => this.handleSquareClick(i, j)}
            />
        );
    }

    handleButtonClick() {
        this.setState({
            xIsNext: !this.state.xIsNext,
        });
    }

    renderToggleLetter() {
        return (
            <ToggleLetter onClick={() => this.handleButtonClick()} />
        );
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'S' : 'O');

        const grid = this.state.squares

        const board = grid.map((row, i) => {
            return (
                <div className="board-row">
                    {row.map((column, j) => {
                        return this.renderSquare(i, j)
                    })}
                </div>
            )
        })

        return (
            <div>
                <div className="status">{status} {this.renderToggleLetter()}</div>
                {board}
            </div>
        );
    }
}

class Game extends Component {
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
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);