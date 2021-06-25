from marshmallow import fields, Schema
from marshmallow_dataclass import class_schema

from game.attributes import Number, Color, Shading, Shape
from game.card import Card
from game.player import Player


CardSchema = class_schema(Card)
PlayerSchema = class_schema(Player)

class GameSchema(Schema):
    board = fields.List(fields.Nested(CardSchema))
    players = fields.List(fields.Nested(PlayerSchema))
    game_over = fields.Bool()
