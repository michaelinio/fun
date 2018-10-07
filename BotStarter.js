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

let readline = require('readline');
let Field = require('./Field');

/**
 * Main class
 * Initializes a map instance and an empty settings object
 */
let Bot = function () {

    if (false === (this instanceof Bot)) {
        return new Bot();
    }

    // initialize options object
    this.options = {
        timebank: '0',
    };
    this.field = null;
    this.previousMove = null;
};

function write(string) {
    process.stderr.write(string);
}


Bot.prototype.init = function () {

    const io = readline.createInterface(process.stdin, process.stdout);

    io.on('line', function (data) {

        if (data.length === 0) {
            return;
        }

        const lines = data.trim().split('\n');

        while (0 < lines.length) {

            const line = lines.shift().trim();
            const lineParts = line.split(" ");

            if (lineParts.length === 0) {
                return;
            }

            const command = lineParts.shift().toCamelCase();

            if (command in bot) {
                const response = bot[command](lineParts);

                if (response && 0 < response.length) {
                    process.stdout.write(response + '\n');
                }
            } else {
                write('Unable to execute command: ' + command + ', with data: ' + lineParts + '\n');
            }
        }
    });

    io.on('close', function () {
        process.exit(0);
    });
};

/**
 * Respond to settings command
 * @param Array data
 */
Bot.prototype.settings = function (data) {
    const key = data[0];
    const value = data[1];

    this.options[key] = isNaN(parseInt(value)) ? value : parseInt(value);
};

Bot.prototype.action = function (data) {
    if (data[0] === 'move') {
        const moves = this.field.getAvailableMoves(this.previousMove);
        const move = moves[Math.floor(Math.random() * moves.length)];

        this.previousMove = move;
        let mypos = this.field.getPos(this.options.your_botid);

            let scores = [
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
            ];

        function dumpScores() {
            // console.error("scores:");
            for (let y = 0; y < 16; y++) {
               let out = '';
                for (let x = 0; x < 16; x++) {
                    out += scores[x][y] + '  |  ';
                }
                console.error(out);
            }
            // console.error("done");
        }
        var f = this.field;
        function score(pos,level) {
            //console.error("scoring: ",pos);
            let childscore = 0;

            let neighbours = f.getNeighbours(pos);
            for (let neighbour of neighbours) {
                let val = f.get(neighbour);
                if (val) {
                    //console.error("val: "+val+" neighbour: ",neighbour);
                    if (val !== '.') {
                        scores[neighbour[0]][neighbour[1]] = 0;
                        //scores[pos[0]][pos[1]] -= 1;
                        childscore /= 2;
                    } else {
                        scores[neighbour[0]][neighbour[1]] *= 2;
                        if (level < 6) {
                            childscore += score(neighbour, level+1);
                        }
                    }

                }
            }
            scores[pos[0]][pos[1]] += childscore;
            return childscore;


        }

        scores[mypos[0]][mypos[1]] = 0;
        score(mypos,0);
        dumpScores();


        console.error("MY POS: ",this.field.getPos(this.options.your_botid));
        console.error("ENEMY POS: ",this.field.getPos(this.options.your_botid == 0 ?  1 : 0));

       // this.field.dump();

        let neighbours = f.getNeighbours(mypos);


        let highest = 0;
        let selected;
        for(let n of neighbours) {
            if (scores[n[0]][n[1]] >= highest) {
                highest = scores[n[0]][n[1]];
                selected = n;
            }
        }
    // console.error("we reccommend: ",neighbours,selected);


        let curx = mypos[0];
        let cury = mypos[1];
        let newx = selected[0];
        let newy = selected[1];

        if (newx < curx) {
            return "left";
        }

        if (newx > curx) {
            return "right";
        }

        if (newy < cury) {
            return "up";
        }

        if (newy > cury) {
            return "down";
        }

        return;
    }
};

Bot.prototype.update = function (data) {
    if (this.field === null) {
        const width = this.options.field_width;
        const height = this.options.field_height;

        this.field = new Field(width, height);
    }

    if (data[0] === 'game') {
        this.field.parseGameData(data[1], data[2]);
    }
};

String.prototype.toCamelCase = function () {
    return this.replace('/', '_').replace(/_[a-z]/g, function (match) {
        return match.toUpperCase().replace('_', '');
    });
};

/**
 * Initialize bot
 * __main__
 */
let bot = new Bot();
bot.init();
