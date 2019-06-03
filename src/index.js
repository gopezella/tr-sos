import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.winner ? 'red' : ''}}>
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
            squares: Array(props.iterationNum).fill(null).map(x => Array(props.iterationNum).fill(null)),
            squaresDatas: [],
            isLetterS: true,
            isPlayerOne: true,
            playerOneScore: 0,
            playerTwoScore: 0,
            isBoardFull: false,
            declareWinner: ''
        };
    }

    componentWillMount() {
        const squaresDatas = this.state.squares.map((row, i) => {
            return row.map((column, j) => {
                const initData = {
                    value: '',
                    winner: false
                }

                return initData;
            })
        });

        this.setState({
            squaresDatas
        });
    }

    renderToggleLetter() {
        return (
            <ToggleLetter onClick={() => this.handleButtonClick()} />
        );
    }

    handleButtonClick() {
        this.setState({
            isLetterS: !this.state.isLetterS,
        });
    }

    handleSquareClick(i, j) {
        const squaresDatas = this.state.squaresDatas.slice();
        squaresDatas[i][j].value = this.state.isLetterS ? 'S' : 'O';
        this.setState({
            squaresDatas,
        });

        this.checkSOS(i, j);
        this.checkIfFull();
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
        const iterationNumLastIndex = this.props.iterationNum - 1;
        for (let i = 0; i < lines.length; i++) {
            const [rowA, columnA, rowB, columnB, rowC, columnC] = lines[i];

            if ((rowA >= 0 && rowA <= iterationNumLastIndex && columnA >= 0 && columnA <= iterationNumLastIndex) 
                    && (rowB >= 0 && rowB <= iterationNumLastIndex && columnB >= 0 && columnB <= iterationNumLastIndex) 
                    && (rowC >= 0 && rowC <= iterationNumLastIndex && columnC >= 0 && columnC <= iterationNumLastIndex)) {
                // console.log(`${rowA}, ${columnA}`);
                // console.log(`${rowB}, ${columnB}`);
                // console.log(`${rowC}, ${columnC}`);
                const pattern = (this.state.squaresDatas[rowA][columnA].value || '') 
                            + (this.state.squaresDatas[rowB][columnB].value || '') 
                            + (this.state.squaresDatas[rowC][columnC].value || '');
                if (pattern === 'SOS') {
                    currentScore += 1;
                    scoreIncremented = true;
                    const squaresDatas = this.state.squaresDatas.map((row, i) => {
                        return row.map((column, j) => {
                            const currentSquare = this.state.squaresDatas[i][j];
                            if ((rowA === i && columnA === j)
                                    || (rowB === i && columnB === j)
                                    || (rowC === i && columnC === j)) {
                                currentSquare.winner = true;
                            }

                            return currentSquare;
                        })
                    })

                    this.setState({
                        squaresDatas
                    })
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

    checkIfFull() {
        const grid = this.state.squaresDatas;

        const foundNotFilled = grid.find((row, i) => {
            return row.find((column, j) => {
                return grid[i][j].value === ''
            })
        })

        console.log(foundNotFilled);

        if (typeof foundNotFilled === 'undefined') {
            this.setState({
                isBoardFull: true
            })
            const scoreOne = this.state.playerOneScore;
            const scoreTwo = this.state.playerTwoScore;
            let declareWinner = '';

            if (scoreOne > scoreTwo) {
                declareWinner = 'Player One wins'
            }
            if (scoreOne < scoreTwo) {
                declareWinner = 'Player Two wins'
            }
            if (scoreOne === scoreTwo) {
                declareWinner = 'It\'s a draw'
            }
            this.setState({
                declareWinner
            });
        }
    }

    render() {
        const status = 'Player ' + (this.state.isPlayerOne ? '1\'s' : '2\'s') + ' turn: ' + (this.state.isLetterS ? 'S' : 'O');
        const playerOneScore = 'Player 1: ' + (this.state.playerOneScore);
        const playerTwoScore = 'Player 2: ' + (this.state.playerTwoScore);

        const grid = this.state.squaresDatas;
        const board = grid.map((row, i) => {
            return (
                <div key={uuid.v4()} className="board-row">
                    {row.map((column, j) => {
                        return <Square
                            key={uuid.v4()}
                            value={this.state.squaresDatas[i][j].value}
                            onClick={() => this.handleSquareClick(i, j)}
                            winner={this.state.squaresDatas[i][j].winner}
                        />
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
                <div className="winner">{this.state.declareWinner}</div>
            </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iterationNum: 4
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board iterationNum={this.state.iterationNum}/>
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