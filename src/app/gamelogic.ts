import { Status } from './gamestatus';

export class Gamelogic {
    gameField: number[][] = new Array();
    currentTurn: number;
    gameStatus: Status;
    scorePlayerOne: number;
    scorePlayerTwo: number;
    playAgain: boolean;
    firstTurn: number;

    winSituations(gameField: number[][]): boolean {
        for (let i:number = 0; i < 3; i++){
            let sumRow:number = 0;
            let sumColumn:number = 0;
            let sumDiagonal:number;
            let sumDiagonalTwo:number;
            for(let j:number = 0; j < 3; j++){
                sumRow = sumRow + gameField[i][j];
                sumColumn = sumColumn + gameField[j][i];
                sumDiagonal = gameField[0][0] + gameField[1][1] + gameField[2][2];
                sumDiagonalTwo = gameField[0][2] + gameField[1][1] + gameField[2][0];
            }
            
            if( sumRow === -3 || sumColumn === -3 || sumDiagonal === -3 || sumDiagonalTwo === -3){
                return true;
            }
            else if ( sumRow === 3 || sumColumn === 3 || sumDiagonal === 3 || sumDiagonalTwo === 3){
                return true;
            }
        }
    }

    public constructor() {
        this.gameStatus = Status.STOP;
        this.scorePlayerOne = 0;
        this.scorePlayerTwo = 0;
        this.playAgain = false;
    }

    gameStart(): void {
        this.gameField = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.currentTurn = this.randomPlayerStart();
        this.gameStatus = Status.START;
        this.playAgain = false;
    }

    randomPlayerStart(): number {
        const startPlayer = Math.floor(Math.random() * 2) + 1;
        this.firstTurn = startPlayer;
        return startPlayer;
    }

    setField(i: number, j:number, value: number): void {
        if(value === 2)
            this.gameField[i][j] = value - 3;
        else
            this.gameField[i][j] = value;
    }

    getSymbol(): string {
        let symbol = (this.currentTurn === this.firstTurn) ? 'X' : 'O';
        return symbol;
    }

    changePlayer(): void {
        this.currentTurn = (this.currentTurn === 2) ? 1 : 2;
    }

    async checkGameEndWinner(): Promise<boolean> {
        let isWinner = false;

        isWinner = this.winSituations(this.gameField);

        if (isWinner){
            this.gameEnd();
            return true;
        } else {
            return false;
        }
    }

    async checkGameEndFull(): Promise<boolean> {
        let isFull = true;

        for(let i: number = 0; i < 3; i++){
            for(let j:number = 0; j<3; j++) {
                if( this.gameField[i][j] == 0 ){
                    isFull = false;
                    break;
                }
            }
        }

        if (isFull){
            this.gameEnd();
            return true;
        } else {
            return false;
        }
    }

    gameEnd(): void {
        this.gameStatus = Status.STOP;
        this.playAgain = true;
    }

    increase(currentTurn:number): void {
        if(currentTurn === 1)
            this.scorePlayerOne++;
        else
            this.scorePlayerTwo++;
    }
}
