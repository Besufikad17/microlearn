const { util } = require("config");

const utils = {};

const card_types = [50, 100, 200, 500, 1000];

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const generateCards = () => {
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr.push(genRanHex(10));
    }
    return arr;
}

cards =[[]];

card_obj = {};

for(var j = 0; j < card_types.length; j++){
    cards[j] = generateCards();
    card_obj[card_types[j]] = generateCards();
}

module.exports = utils;

