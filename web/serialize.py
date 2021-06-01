from marshmallow import fields, Schema
from marshmallow_dataclass import class_schema

from game.attributes import Number, Color, Shading, Shape
from game.card import Card


CardSchema = class_schema(Card)


class GameSchema(Schema):
    board = fields.List(fields.Nested(CardSchema))