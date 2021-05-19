import dataclasses
import json
from enum import Enum

from game.attributes import Number, Color, Shading, Shape
from game.card import Card


class CardEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Enum):
            return o.name
        if isinstance(o, Card):
            return dataclasses.asdict(o)
        return json.JSONEncoder.default(self, o)


def as_card(dct):
    if '__card__' in dct:
        return Card(Number[dct['number']], Color[dct['color']], Shading[dct['shading']], Shape[dct['shape']])
    return dct


def serialize_board(game):
    return json.dumps(list(game.board.keys()), cls=CardEncoder)


def serialize_cards(objs):
    return [Card(**obj) for obj in objs]