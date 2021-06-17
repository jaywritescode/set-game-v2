from game.card import Card
from game.setgame import Game

# There's no Set in this collection of 20 cards.
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


def test_deal_next_succeeds():
    game = Game()

    result = game.deal_next()
    assert result

    result = set(result)
    # assert that three cards were moved from the deck to the board
    assert len(game.board.keys()) == 3
    assert result.issubset(game.board.keys())
    assert result.isdisjoint(game.deck)


def test_deal_next_fails():
    game = Game()
    game.deck = []

    assert game.deal_next() is None


def test_ensure_solvable():
    game = Game()

    for card in cap[:12]:
        find_and_move_card(game, card)

    assert not game.has_set()

    game.ensure_solvable()

    assert game.has_set()


def find_and_move_card(game, card):
    game.deck.remove(card)
    game.board.update(dict.fromkeys([card]))