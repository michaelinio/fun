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
        this.roundNo = 0;
        this.moveNo = 0;
        this.width = width;
        this.height = height;

        this.constructGrid();
    };


    Field.prototype.dump = function() {
       for (let y = 0; y < this.height; y++) {
           let out = '';
            for (let x = 0; x < this.width; x++) {
                out += this.grid[x][y];
            }
            // console.error(out);
        }
        // console.error("done");
    };

    Field.prototype.constructGrid = function () {

        this.grid = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.grid[i] = Array.from({ length: this.width }).map(() => '0');
        }

    };

    Field.prototype.getPos = function(id) {
         for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y] == id) {
                    return [x,y];
                }
            }
        }
    };

    Field.prototype.parseGameData = function (key, value) {

        if (key === 'round') {
            this.roundNo = Number(value);
        }

        if (key === 'field') {
            this.parseFromString(value);
        }
    };

    Field.prototype.parseFromString = function (s) {

        let r = s.split(',');
        //let counter = this.height;
        let counter = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[x][y] = r[counter];
                counter++;
            }
        }
    };

    Field.prototype.get = function(pos) {
        var xrow = this.grid[pos[0]];
        if (xrow === undefined) return undefined;
        return this.grid[pos[0]][pos[1]];
    };

    Field.prototype.getNeighbours = function(pos) {
        var x = pos[0];
        var y = pos[1];

        var neighbours = [[x-1,y], [x,y-1],[x+1,y],[x,y+1]];
        let result = [];
        for (let n of neighbours) {
            if (n[0] >= 0 && n[1] >= 0 && n[0] < 16 && n[1] < 16) {
                result.push(n);
            }

        }


        //console.error("neighbours: ",neighbours);

        return result;

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
