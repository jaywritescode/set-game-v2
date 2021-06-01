from itertools import combinations, product
from more_itertools import all_equal, all_unique, replace
import random

from .attributes import Number, Color, Shading, Shape
from .card import Card


class Game:

    def __init__(self):
        self.deck = create_deck()
        self.board = dict()

    def start(self):
        random.shuffle(self.deck)

        board, self.deck = self.deck[:12], self.deck[12:]
        self.board = dict.fromkeys(board)
        self.ensure_solvable()

    def ensure_solvable(self):
        while not self.has_set():
            deal, self.deck = self.deck[:3], self.deck[3:]
            self.board.update(dict.fromkeys(deal))

    def has_set(self):
        return any(cards[0].product(cards[1]) in self.board for cards in combinations(self.board.keys(), 2))

    def receive_set(self, cards):
        assert all(card in self.board for card in cards)
        assert is_set(cards)

        deal, self.deck = self.deck[:3], self.deck[3:]
        _board = replace(self.board.keys(), lambda card: card in cards, deal)
        self.board = dict.fromkeys(_board)

        self.ensure_solvable()
        return self


def is_set(triplet):
    return all(all_equal(attrs) or all_unique(attrs) for attrs in zip(triplet))


def create_deck():
    return [Card(*attrs) for attrs in product(Number, Color, Shading, Shape)]