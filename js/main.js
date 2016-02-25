var cardsList = new Array(41);
var dC, cC, mC;

function init() {
    var done = 0;
    for (var i = 0; i < 55; i++) {
        cardsList[i] = new Image();
        cardsList[i].onload = function() {done++;if (done == cardsList.length)postInit();}
        cardsList[i].src = 'img/uno' + i + '.gif';
        cardsList[i].cardId = i;
        cardsList[i].className = "card";
    }
    cC = document.getElementById('curentCard');
    dC = document.getElementById('drawCard');
}

function postInit() {
    dC.appendChild(cardsList[0].cloneNode());
    dC.firstChild.onclick = drawCard;

    window.addEventListener("resize", function () {
        render();
    });

    mC = draw(true);
    var pl1 = new player();
    var pc1 = new computer();
    players[0].isTurn = true;

    render();
}

function card(id) {
    this.id = id;
    this.img = cardsList[id].cloneNode();
    this.color = ["red","green","blue","yellow","any"][id == 0 ? 4 : Math.floor((id - 1) / 13)];
    this.number = (id - 1) % 13;
    this.canBePlacedOn = function(card) {
        var can = card.color == this.color;
        can = can || card.color == "any";
        can = can || card.number == this.number;
        return can;
    }

    this.makePlayebleCard = function(player) {
        this.player = player;
        var self = this;
        this.img.onclick = function() {
            if (!self.player.isTurn) return;
            if (self.canBePlacedOn(mC)) {
                mC = new card(self.id);
                self.player.cards.splice(self.player.cards.indexOf(self),1);
                nextPlayer();
                render();
            }
        }
        return this;
    }
}

function draw(special) {
    var id = Math.floor((Math.random() * 54) + 1);
    if (special) while (id == 53 || id == 54 || id % 13 == 11 || id % 13 == 12 || id % 13 == 0) id = Math.floor((Math.random() * 54) + 1);
    return new card(id);
}

var players = [];
function player(cards) {
    this.cards = [];
    var cards = cards || 7;
    for (var i = 0;i < cards;i++) this.cards.push(draw().makePlayebleCard(this));
    this.isTurn = false;
    this.con = document.createElement('div');
    this.con.style.position = "absolute";
    document.getElementById('cards').appendChild(this.con);
    players.push(this);
}

function computer(cards) {
    this.cards = [];
    var cards = cards || 7;
    for (var i = 0;i < cards;i++) this.cards.push(draw());
    this.isTurn = false;
    this.con = document.createElement('div');
    this.con.style.position = "absolute";
    document.getElementById('cards').appendChild(this.con);
    players.push(this);

    this.run = function() {
        var can;
        var self = this;
        this.cards.forEach(function(_card) {
            if (!can && _card.canBePlacedOn(mC)) {
                can = true;
                mC = new card(_card.id);
                self.cards.splice(self.cards.indexOf(_card),1);
                nextPlayer();
                render();
            }
        });
        if(!can) {
            var nC = draw();
            if (!nC.canBePlacedOn(mC)) this.cards.push(nC);
            nextPlayer();
        }
    }
}

function drawCard() {
    players.forEach(function(_player) {
        if (_player.isTurn) {
            var can;
            _player.cards.forEach(function(cards){can = can || cards.canBePlacedOn(mC)});
            if (!can) _player.cards.push(draw().makePlayebleCard(_player));
            _player.cards.forEach(function(cards){can = can || cards.canBePlacedOn(mC)});
            if (!can) nextPlayer();
        }
    });
    render();
}

function nextPlayer() {
    var cp;
    players.forEach(function(_player) {if (_player.isTurn) cp = players.indexOf(_player);});
    players[cp].isTurn = false;
    if (cp == players.length-1) cp=-1;
    cp++;
    players[cp].isTurn = true;

    if (typeof players[cp].run != 'undefined') players[cp].run();
}

function render() {
    if (cC.firstChild) cC.removeChild(cC.firstChild);
    cC.appendChild(mC.img);


    var radius = Math.min((window.innerWidth / 2) - 44, (window.innerHeight / 2) - 64);
    var angle = 90 * Math.PI / 180;
    var step = 2 * Math.PI / players.length;
    players.forEach(function (player) {
        while (player.con.firstChild) player.con.removeChild(player.con.firstChild);

        player.cards.sort(function (a, b) {
            return a.id < b.id ? -1 : 1;
        });
        player.cards.forEach(function (card) {
            player.con.appendChild(card.img);
            if (player.isTurn) card.img.className = "activeCard"; else player.con.className = "";
        });
        if (player.isTurn) player.con.className = "activeCard"; else player.con.className = "";

        var x = window.innerWidth / 2 + radius * Math.cos(angle) - player.cards.length * 22;
        var y = window.innerHeight / 2 + radius * Math.sin(angle) - 32;
        var rot = players.indexOf(player) * (360 / players.length);

        player.con.style.top = y + "px";
        player.con.style.left = x + "px";
        player.con.style['-moz-transform'] = "rotate(" + rot + "deg)";
        player.con.style.MozTransform = "rotate(" + rot + "deg)";
        player.con.style['-webkit-transform'] = "rotate(" + rot + "deg)";
        player.con.style['-o-transform'] = "rotate(" + rot + "deg)";
        player.con.style['-ms-transform'] = "rotate(" + rot + "deg)";

        angle += step;
    });
}
