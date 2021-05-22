from game.card import Card
from game.setgame import Game

cap = [Card.from_str(s) for s in [
    'one green empty diamond',
    'one green solid diamond',
    'one red striped diamond',
    'one blue striped squiggle',
    'one red empty squiggle',
    'one red solid squiggle',
    'one green empty oval',
    'one green solid oval',
    'one red striped oval',
    'two green striped squiggles',
    'two red striped squiggles',
    'three green striped diamonds',
    'three red empty diamonds',
    'three red solid diamonds',
    'three green empty squiggles',
    'three green solid squiggles',
    'three blue striped squiggles',
    'three green striped ovals',
    'three red empty ovals',
    'three red solid ovals',
]]


def test_ensure_solvable():
    game = Game()

    for card in cap[:12]:
        game.deck.remove(card)
        game.board[card] = None

    assert not game.has_set()

    game.ensure_solvable()

    assert game.has_set()
