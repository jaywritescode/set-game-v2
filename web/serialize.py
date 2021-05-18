import dataclasses
import json
from enum import Enum

from game.card import Card


class CardEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Enum):
            return o.name
        if isinstance(o, Card):
            return dataclasses.asdict(o)
        return json.JSONEncoder.default(self, o)


def serialize_board(game):
    return json.dumps(list(game.board.keys()), cls=CardEncoder)