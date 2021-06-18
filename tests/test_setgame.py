from game.card import Card
from game.setgame import Game, is_set

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

"""
def test_is_set():
    # all four properties different
    cards = [
        Card.from_str('one red striped diamond'),
        Card.from_str('two green solid squiggles'),
        Card.from_str('three blue empty ovals')
    ]
    assert is_set(cards)

    # three different, one same
    cards = [
        Card.from_str('one blue solid oval'),
        Card.from_str('two blue striped diamonds'),
        Card.from_str('three blue empty squiggles')
    ]
    assert is_set(cards)

    # two different, two same
    cards = [
        Card.from_str('two red empty ovals'),
        Card.from_str('two blue empty diamonds'),
        Card.from_str('two green empty squiggles')
    ]
    assert is_set(cards)

    # one different, three same
    cards = [
        Card.from_str('three red solid squiggles'),
        Card.from_str('three red solid diamonds'),
        Card.from_str('three red solid ovals')
    ]
    assert is_set(cards)

    # not a set
    cards = [
        Card.from_str('one blue solid squiggle'),
        Card.from_str('one green solid oval'),
        Card.from_str('two red striped diamonds')
    ]
    breakpoint()
    assert not is_set(cards)
"""


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

    result = game.ensure_solvable()

    assert result
    assert game.has_set()


def find_and_move_card(game, card):
    game.deck.remove(card)
    game.board.update(dict.fromkeys([card]))