// Copyright 2017 Riddles.io

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

(function () {

    let Field = function (width, height) {

        this.grid = [];
        this.gameField = [];
        this.roundNo = 0;
        this.moveNo = 0;
        this.width = width;
        this.height = height;
        this.parsedvalue=null;
        this.me=null;
        this.botid=null;
        this.enemy=null;

        this.constructGrid();
        this.initGameField()
    };
    Field.prototype.initGameField = function  () {

        for (let x=0; x < this.width; x++) {
            this.gameField[x]= new Array();
            for (let y=0; y < this.height; y++) {
                this.gameField[x][y] = 0;
            }
        }
        console.error(this.gameField);
    };

    Field.prototype.setBotid = function (id) {
        this.botid = id;
    };


    Field.prototype.constructGrid = function () {

        this.grid = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.grid[i] = Array.from({ length: this.width }).map(() => '0');
        }

    };

    Field.prototype.parseGameData = function (key) {

        if (key === 'round') {
            this.roundNo = Number(this.parsedvalue);
        }

        if (key === 'field') {
            this.parseFromString(this.parsedvalue);
            this.updateGameField();
            console.error(this.gameField);
            console.error('me: ',this.me,'enemy: ',this.enemy);
            console.error(this.getNeighbours());
            console.error("===============================================================================================================");
        }
    };

    Field.prototype.getNeighbours = function() {
        result = [];
        var x = this.me[0][0];
        var y =this.me[1][0];
        console.error(x,y);
        result.push(this.gameField[x][y]);
        return result;
    };
    Field.prototype.updateGameField = function () {
        let bad = 0;
        let good = 1;
        let r = this.parsedvalue.split(',');
        let counter = 0;

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (r[counter] == ".") {
                    this.gameField[x][y] = good;
                }
                if (r[counter] == "x") {
                    this.gameField[x][y] = bad;
                }
                if (r[counter] == 0) {
                    if (0 == this.botid){this.me = [[y],[x]]}else {this.enemy = [[y],[x]];}
                    this.gameField[x][y] = bad;
                }
                if (r[counter] == 1) {
                    if (1 == this.botid){this.me = [[y],[x]]}else {this.enemy = [[y],[x]]}
                    this.gameField[x][y] = bad;
                }

                counter++;
            }
        }
    };

    Field.prototype.parseFromString = function (s) {

        let r = s.split(',');
        let counter = this.height;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y] === Number) {
                    //parse only numbers
                    this.grid[x][y] = Number(r[counter]);
                }
                else {
                    this.grid[x][y] = r[counter];
                }
                counter++;
            }
        }
    };

    Field.prototype.getAvailableMoves = function (previousMove) {

        // Starterbot: Don't return previous move
        const allMoves = ['up', 'down', 'left', 'right'];

        return allMoves.filter(move => move !== getOpposingMove(previousMove));
    };

    module.exports = Field;

})();


function getOpposingMove(move) {
    switch (move) {
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return null;
    }
}