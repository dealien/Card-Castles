var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var suits = ["diams", "hearts", "spades", "clubs"];
var deck = [];

function buildDeck() {
  var deck = [];
  for (var i = 0; i < suits.length; i++) {
    for (var x = 0; x < ranks.length; x++) {
      var card = {
        rank: ranks[x],
        suit: suits[i]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffle(d) {
  // for 1000 turns
  // switch the values of two random cards
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * d.length);
    var location2 = Math.floor(Math.random() * d.length);
    var tmp = d[location1];
    // console.log(location1 + " " + location2, tmp);

    d[location1] = d[location2];
    d[location2] = tmp;
  }
  return d;
}

function rebuild(d, r) {
  return d.filter(function(el) {
    return r.indexOf(el) < 0;
  });
}

function draw(d) {
  // remove top card from deck
  var c = d[d.length - 1];
  d.splice(d.length - 1, 1);
  return c;
}

function renderCard(c) {
  var d = c;
  if (c.rank == 11) {
    d.rank = "J";
  } else if (c.rank == 12) {
    d.rank = "Q";
  } else if (c.rank == 13) {
    d.rank = "K";
  }
  return (
    '<div class="card rank-' +
    d.rank.toLowerCase() +
    " " +
    d.suit +
    '"><div class="rank">' +
    d.rank +
    '</div><div class="suit">&' +
    d.suit +
    ";</div></div>"
  );
}

function displayDefense() {
  $("#p1-defense").empty();
  $("#p2-defense").empty();
  for (i = 0; i < p1known.length; i++) {
    $("#p1-defense").append("<li>" + renderCard(p1known[i]) + "</li>");
  }
  for (i = 0; i < p2known.length; i++) {
    $("#p2-defense").append("<li>" + renderCard(p2known[i]) + "</li>");
  }
  for (i = 0; i < 8 - p1known.length; i++) {
    $("#p1-defense").append('<div class="card back">*</div>');
  }
  for (i = 0; i < 8 - p2known.length; i++) {
    $("#p2-defense").append('<div class="card back">*</div>');
  }
}

function chooseBest(defender) {
  var c;
  if (defender == "p1") {
    if (p1known.length === 0) {
      return p1hidden.pop();
    } else {
      for (i = 0; i < p1known.length; i++) {
        c = p1known[i];
        if (c.rank > acard.rank * 0.75) {
          return c;
        }
      }
    }
  } else {
    if (p2known.length === 0) {
      return p2hidden.pop();
    } else {
      for (i = 0; i < p2known.length; i++) {
        c = p2known[i];
        if (c.rank > acard.rank * 0.75) {
          return c;
        }
      }
    }
  }
}

console.clear();

var deck = shuffle(buildDeck());
var turns = [];
var tplayer = "p1";
var p1hidden = [];
var p2hidden = [];
var p1known = [];
var p2known = [];
var p1scored = [];
var p2scored = [];
var p1score = 0;
var p2score = 0;

for (i = 0; i < 8; i++) {
  p1hidden.push(draw(deck));
  p2hidden.push(draw(deck));
  $("#p1-defense").append('<div class="card back">*</div>');
  $("#p2-defense").append('<div class="card back">*</div>');
}

while (
  p1hidden.length + p1known.length > 0 &&
  p2hidden.length + p2known.length > 0
) {
  if (deck.length === 0) {
    deck = rebuild(shuffle(buildDeck()), p1scored.concat(p2scored));
  }
  console.log(p1hidden.length);
  console.log(p2hidden.length);
  console.log(tplayer);
  if (tplayer == "p1") {
    var acard = draw(deck);
    $("#attack").empty();
    $("#attack").append(renderCard(acard));
    dcard = chooseBest("p2");
    console.log([acard, dcard]);
    turns.push([acard, dcard]);
    if (acard.rank > dcard.rank) {
      p1scored.push([acard, dcard]);
      p1score += acard.rank + dcard.rank;
    }
    tplayer = "p2";
  } else {
    var acard = draw(deck);
    $("#attack").empty();
    $("#attack").append(renderCard(acard));
    dcard = chooseBest("p1");
    console.log([acard, dcard]);
    turns.push([acard, dcard]);
    if (acard.rank > dcard.rank) {
      p2scored.push([acard, dcard]);
      p2score += acard.rank + dcard.rank;
    }
    tplayer = "p1";
  }
}
console.log(turns);
console.log("p1score: ", p1score);
console.log("p2score: ", p2score);
