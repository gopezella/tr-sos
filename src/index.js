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
            squares: Array(5).fill(null).map(x => Array(5).fill(null)),
            xIsNext: true,
            isPlayerOne: true,
            playerOneScore: 0,
            playerTwoScore: 0,
            isBoardFull: false
        };
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

            this.checkSOS(i, j);
        }

        // const grid = this.state.squares;
        // let full = this.state.isBoardFull;
        // const scoreOne = this.state.playerOneScore;
        // const scoreTwo = this.state.playerTwoScore;

        // if (full) {
        //     console.log('Player One Score: ' + scoreOne);
        //     console.log('Player Two Score: ' + scoreTwo);
        //     if (scoreOne > scoreTwo) {
        //         console.log('Player One wins')
        //     }
        //     if (scoreOne < scoreTwo) {
        //         console.log('Player Two wins')
        //     }
        // }
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
        let scoreIncremented = false;

        for (let i = 0; i < lines.length; i++) {
            const [ar, ac, br, bc, cr, cc] = lines[i];

            if ((ar >= 0 && ar <= 4) && (br >= 0 && br <= 4) && (cr >= 0 && cr <= 4)) {

                const pattern = this.state.squares[ar][ac] + this.state.squares[br][bc] + this.state.squares[cr][cc];
                if (pattern === 'SOS') {
                    currentScore += 1;
                    scoreIncremented = true;
                }
            }
        }

        if (this.state.isPlayerOne) {
            this.setState({
                playerOneScore: currentScore
            })
        } else {
            this.setState({
                playerTwoScore: currentScore
            })
        }

        if (!scoreIncremented) {
            this.setState({
                isPlayerOne: !this.state.isPlayerOne
            })
        }
    }

    render() {
        const status = 'Player ' + (this.state.isPlayerOne ? '1\'s' : '2\'s') + ' turn: ' + (this.state.xIsNext ? 'S' : 'O');
        const playerOneScore = 'Player 1: ' + (this.state.playerOneScore);
        const playerTwoScore = 'Player 2: ' + (this.state.playerTwoScore);

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
                <div className="score">{playerOneScore}</div>
                <div className="score">{playerTwoScore}</div>
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