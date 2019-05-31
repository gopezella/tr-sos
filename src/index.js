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

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(18).fill(null).map(x => Array(18).fill(null)),
            xIsNext: true,
            isPlayerOne: true,
            playerOneScore: 0,
            playerTwoScore: 0
        };
    }

    renderSquare(i, j) {
        return (
            <Square
                value={this.state.squares[i][j]}
                onClick={() => this.handleSquareClick(i, j)}
            />
        );
    }

    handleSquareClick(i, j) {
        const squares = this.state.squares.slice();
        if (squares[i][j] == null) {
            squares[i][j] = this.state.xIsNext ? 'S' : 'O';
            this.setState({
                squares: squares,
            });
        }
        this.checkSOS(i, j);

        // const grid = this.state.squares;

        // grid.map((row, i) => {
        //             row.map((column, j) => {
        //                 if (grid[i][j]==null) {

        //                 }
        //             })
        //             return null;
        //         }
        // )
    }

    renderToggleLetter() {
        return (
            <ToggleLetter onClick={() => this.handleButtonClick()} />
        );
    }

    handleButtonClick() {
        this.setState({
            xIsNext: !this.state.xIsNext,
        });
    }

    checkSOS(row, column) {
        const lines = [
            [row, column, row, column + 1, row, column + 2],
            [row, column, row + 1, column, row + 2, column],
            [row, column, row + 1, column + 1, row + 2, column + 2],
            [row, column, row + 1, column - 1, row + 2, column - 2],
            [row, column, row, column - 1, row, column - 2],
            [row, column, row - 1, column, row - 2, column],
            [row, column, row - 1, column - 1, row - 2, column - 2],
            [row, column, row - 1, column + 1, row - 2, column + 2],

            [row, column - 1, row, column, row, column + 1],
            [row - 1, column, row, column, row + 1, column],
            [row - 1, column - 1, row, column, row + 1, column + 1],
            [row - 1, column + 1, row, column, row + 1, column - 1],
        ];

        let currentScore = this.state.isPlayerOne ? this.state.playerOneScore : this.state.playerTwoScore;
        const player = this.state.isPlayerOne ? 'one' : 'two';

        for (let i = 0; i < lines.length; i++) {
            const [ar, ac, br, bc, cr, cc] = lines[i];

            if ((ar >= 0 && ar <= 17) && (br >= 0 && br <= 17) && (cr >= 0 && cr <= 17)) {

                const pattern = this.state.squares[ar][ac] + this.state.squares[br][bc] + this.state.squares[cr][cc];
                if (pattern === 'SOS') {
                    currentScore += 1;
                }
            }
        }
        if (this.state.isPlayerOne) {
            this.setState({
                playerOneScore: currentScore
            })
        }
        else {
            this.setState({
                playerTwoScore: currentScore
            })
        }

        console.log(player + ": " + currentScore);
        this.setState({
            isPlayerOne: !this.state.isPlayerOne
        })
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'S' : 'O');

        const grid = this.state.squares;

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
    constructor(props) {
        super(props);
        this.state = {
            // playerOneScore: 0,
            // playerTwoScore: 0
        };
    }

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