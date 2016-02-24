var cardsList = new Array(41);
var players = [],
    curentCard,turn = "local";

function init() {
    for (var i = 0; i < 55; i++) {
        cardsList[i] = new Image();
        cardsList[i].src = 'img/uno' + i + '.gif';
        cardsList[i].cardId = i;
        cardsList[i].className = "card";
    }
    l("drawCard").appendChild(cardsList[0].cloneNode());
    l("drawCard").firstChild.onclick = function() {drawCard()};
    curentCard = giveRndCard(1, true)[0];
    setupPlayers();
    renderCards();
    makeActive(l("local"));
}

function addPlayer(name, isViseble, cards) {
    cards = cards || [];
    var player = {
        "name": name,
        "obj": document.createElement('div'),
        "cards": cards,
        "isViseble": isViseble || false
    }
    player.obj.id = name;
    player.obj.style.position = "absolute";
    player.obj.style.top = "0px";
    player.obj.style.left = "0px";
    l("cards").appendChild(player.obj);
    players.push(player);
    return player;
}

function renderCards() {
    if (l("curentCard").firstChild) l("curentCard").removeChild(l("curentCard").firstChild);
    l("curentCard").appendChild(curentCard);


    var radius = Math.min((window.innerWidth / 2) - 44, (window.innerHeight / 2) - 64);
    var angle = 90 * Math.PI / 180,
        step = (2 * Math.PI) / players.length;
    players.forEach(function (player) {
        if (!l(player.name)) addPlayer(player.name);
        while (l(player.name).firstChild) l(player.name).removeChild(l(player.name).firstChild);

        if (player.isViseble) {
            sortCards(player.cards).forEach(function (card) {
                card.onclick = function() {placeCard(this)};
                l(player.name).appendChild(card);
            });
        } else {
            player.cards.forEach(function (card) {
                l(player.name).appendChild(cardsList[0].cloneNode());
            });
        }

        var x = window.innerWidth / 2 + radius * Math.cos(angle) - player.cards.length * 22;
        var y = window.innerHeight / 2 + radius * Math.sin(angle) - 32;
        var rot = players.indexOf(player) * (360 / players.length);

        l(player.name).style.top = y + "px";
        l(player.name).style.left = x + "px";
        l(player.name).style['-moz-transform'] = "rotate(" + rot + "deg)";
        l(player.name).style.MozTransform = "rotate(" + rot + "deg)";
        l(player.name).style['-webkit-transform'] = "rotate(" + rot + "deg)";
        l(player.name).style['-o-transform'] = "rotate(" + rot + "deg)";
        l(player.name).style['-ms-transform'] = "rotate(" + rot + "deg)";

        angle += step;
    });
}

function giveRndCard(amount, noSecial) {
    noSecial = true;

    var cards = [];
    for (var i = 0; i < amount; i++) {
        cards.push(cardsList[Math.floor((Math.random() * 54) + 1)].cloneNode(true));
    }
    if (noSecial) {
        var isSpecial = false;
        cards.forEach(function (card) {
            var cardid = getCardIdBySrc(card.src)
            if (cardid == 53 || cardid == 54 || cardid % 13 == 11 || cardid % 13 == 12 || cardid % 13 == 0) isSpecial = true;
        });
        if (isSpecial) return giveRndCard(amount, true);
    }
    return cards;
}

function sortCards(_cards) {
    var tmp;
    var cards = _cards.sort(function (a, b) {
        return getCardIdBySrc(a.src) < getCardIdBySrc(b.src) ? -1 : 1;
    });
    return cards;
}

function setupPlayers() {
    addPlayer("local", true).cards = giveRndCard(7);
    addPlayer("pc1", true).cards = giveRndCard(7);
    addPlayer("pc2",true).cards = giveRndCard(7);
    //addPlayer("pc3").cards = giveRndCard(7);
    //addPlayer("pc4").cards = giveRndCard(7);

    //while (l("p2c").childNodes.length > 7) l("p2c").removeChild(l("p2c").firstChild);
    //while (l("p2c").childNodes.length < 7) l("p2c").appendChild(cardsList[0].cloneNode(true));
}

function canCardBePlaced(card1, card2) {
    var can = Math.floor((card1 - 1) / 13) == Math.floor((card2 - 1) / 13);
    can = can || card1 == 53 || card1 == 54;
    can = can || (card1 - 1) % 13 == (card2 - 1) % 13;
    return can;
}

function placeCard(card) {
    console.log(card);
    if (turn != card.parentNode.id) return false;

    if (!canCardBePlaced(getCardIdBySrc(card.src),getCardIdBySrc(curentCard.src))) return false;

    curentCard = cardsList[getCardIdBySrc(card.src)].cloneNode();
    var player = getPlayerByName(turn);
    player.cards.splice(player.cards.indexOf(card),1);
    renderCards();
    nextPlayer(player);
}

function drawCard() {
    var player = getPlayerByName(turn);
    if (!canPlaceCard(player)) {
        player.cards.push(giveRndCard(1)[0]);
        player.cards = sortCards(player.cards);
        if (!canPlaceCard(player)) nextPlayer(player);
        renderCards();
        console.log("drawed card!");
    }
}

function canPlaceCard(player) {
    var can = false;
    player.cards.forEach(function(card){
        can = can || canCardBePlaced(card,curentCard);
    });
    return can;
}

function nextPlayer(player) {
    var cindex = players.indexOf(player);
    var nindex = cindex + 1;
    if (cindex == players.length - 1) nindex = 0;
    turn = players[nindex].name;
    makeActive(players[nindex].obj);
    makeNonActive(player.obj)
}

function l(id) {
    return document.getElementById(id);
}

function getCardIdBySrc(src) {
    return parseInt(src.replace(/^.*[\\\/]/, '').substring(3));
}

function getPlayerByName(name) {
    for (var i = 0;i < players.length;i++) {
        if (players[i].name == name) return players[i];
    }
    return null;
}

function makeActive(player) {
    for (var i = 0;i<player.children.length;i++) {
        player.children[i].classList.add("activeCard");
    }
}
function makeNonActive(player) {
    for (var i = 0;i<player.children.length;i++) {
        player.children[i].classList.remove("activeCard");
    }
}

window.addEventListener("resize", function () {
    renderCards();
});
