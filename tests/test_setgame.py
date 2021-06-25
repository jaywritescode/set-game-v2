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


def test_add_player():
    game = Game()
    game.add_player("Sir Robin")
    game.add_player("Tim")

    assert [p.name for p in game.players] == ['Sir Robin', 'Tim']


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
    assert not is_set(cards)



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


def test_find_all_sets():
    game = Game()
    cards = [Card.from_str(x) for x in [
        'one green empty diamond', 'three red empty squiggles', 'three green solid ovals',
        'three blue striped diamonds', 'three green solid squiggles', 'two blue empty ovals',
        'two blue solid diamonds', 'two green striped ovals', 'three red empty diamonds',
        'two blue empty squiggles', 'two red solid diamonds', 'two blue striped squiggles'
    ]]
    game.board = dict.fromkeys(cards)

    solution = {
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three red empty squiggles', 'two blue empty ovals'}),
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three blue striped diamonds', 'two red solid diamonds'}),
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three green solid squiggles', 'two green striped ovals'}),
        frozenset(Card.from_str(x) for x in {'three red empty squiggles', 'three green solid ovals', 'three blue striped diamonds'}),
        frozenset(Card.from_str(x) for x in {'two blue empty ovals', 'two blue solid diamonds', 'two blue striped squiggles'}),
        frozenset(Card.from_str(x) for x in {'two green striped ovals', 'two blue empty squiggles', 'two red solid diamonds'})
    }
    assert game.find_all_sets() == solution


def test_find_set():
    game = Game()
    cards = [Card.from_str(x) for x in [
        'one green empty diamond', 'three red empty squiggles', 'three green solid ovals',
        'three blue striped diamonds', 'three green solid squiggles', 'two blue empty ovals',
        'two blue solid diamonds', 'two green striped ovals', 'three red empty diamonds',
        'two blue empty squiggles', 'two red solid diamonds', 'two blue striped squiggles'
    ]]
    game.board = dict.fromkeys(cards)

    solution = {
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three red empty squiggles', 'two blue empty ovals'}),
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three blue striped diamonds', 'two red solid diamonds'}),
        frozenset(Card.from_str(x) for x in {'one green empty diamond', 'three green solid squiggles', 'two green striped ovals'}),
        frozenset(Card.from_str(x) for x in {'three red empty squiggles', 'three green solid ovals', 'three blue striped diamonds'}),
        frozenset(Card.from_str(x) for x in {'two blue empty ovals', 'two blue solid diamonds', 'two blue striped squiggles'}),
        frozenset(Card.from_str(x) for x in {'two green striped ovals', 'two blue empty squiggles', 'two red solid diamonds'})
    }
    assert game.find_set() in solution


def find_and_move_card(game, card):
    game.deck.remove(card)
    game.board.update(dict.fromkeys([card]))