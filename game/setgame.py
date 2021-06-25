import dataclasses
from itertools import combinations, product
from more_itertools import all_equal, all_unique, replace, distribute, peekable
import random

from .attributes import Number, Color, Shading, Shape
from .card import Card
from .player import Player


class Game:

    def __init__(self):
        self.deck = create_deck()
        self.board = dict()
        self.players = list()
        self.game_over = False

    def start(self):
        random.shuffle(self.deck)

        for _ in range(4):
            self.deal_next()
        self.ensure_solvable()

    def add_player(self, player_name):
        self.players.append(Player(player_name))

    def deal_next(self):
        """Moves the top three cards from the deck to the board.

        Returns:
            list[Card]: a list of cards if successful, otherwise None
        """
        if not len(self.deck):
            return None

        deal, self.deck = self.deck[:3], self.deck[3:]
        self.board.update(dict.fromkeys(deal))
        return deal

    def ensure_solvable(self):
        """Ensures thaat the board contains a Set.

        Deals three cards at a time until the board has at least one
        Set.

        Returns:
            bool: True if successful, otherwise False
        """
        while not self.has_set():
            result = self.deal_next()
            if not result:
                return False
        return True

    def has_set(self):
        return any(cards[0].product(cards[1]) in self.board for cards in combinations(self.board.keys(), 2))

    def find_all_sets(self):
        sets = set()
        for c in combinations(self.board.keys(), 2):
            product = Card.product(*c)
            if product in self.board:
                sets.add(frozenset([*c, product]))

        return sets

    def find_set(self):
        """Finds a Set on the board."""
        partitioned = distribute(2, self.board.keys())
        combos = [combinations(p, 2) for p in partitioned]
        peekables = [peekable(iter(c)) for c in combos]

        while all(p.peek(None) is not None for p in peekables):
            for p in peekables:
                if p.peek(None) is None:
                    continue
                pair = next(p)
                completing_card = pair[0].product(pair[1])
                if completing_card in self.board.keys():
                    return {pair[0], pair[1], completing_card}

    def receive_set(self, cards):
        """Handles a player finding a Set.

        Args:
            list[Card]: a list of three Cards

        Returns:
            self

        Raises:
            ValueError: if one or more Cards is not on the board or 
                the three Cards do not make a Set
        """
        if not all(card in self.board for card in cards):
            raise ValueError("Invalid selection.")
        if not is_set(cards):
            raise ValueError("Selection is not a Set.")

        deal, self.deck = self.deck[:3], self.deck[3:]
        _board = replace(self.board.keys(), lambda card: card in cards, deal)
        self.board = dict.fromkeys(_board)

        solveable = self.ensure_solvable()
        if not solveable:
            self.game_over = True
        return self


def is_set(cards):
    """Determines if a collection of Cards makes a Set.

    Args:
        list[Card]: a list of Cards

    Returns:
        bool: True if cards makes a Set, otherwise False
    """
    if len(cards) != 3:
        return False

    attrs = [dataclasses.asdict(card).values() for card in cards]
    return all(all_equal(attr) or all_unique(attr) for attr in zip(*attrs))


def create_deck():
    return [Card(*attrs) for attrs in product(Number, Color, Shading, Shape)]