from game.attributes import Number, Color, Shading, Shape
from game.card import Card


def as_card(dct):
    if '__card__' in dct:
        number, color, shading, shape = [dct[key].upper() for key in ['number', 'color', 'shading', 'shape']]
        return Card(Number[number], Color[color], Shading[shading], Shape[shape])
    return dct