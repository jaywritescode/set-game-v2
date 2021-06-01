from enum import IntEnum, auto


class AutoNumber(IntEnum):
    """
    Index the enums representing attributes starting at zero.
    """
    def _generate_next_value_(name, start, count, last_values):
        return count


class Number(AutoNumber):
    one = auto()
    two = auto()
    three = auto()


class Color(AutoNumber):
    red = auto()
    blue = auto()
    green = auto()


class Shading(AutoNumber):
    empty = auto()
    striped = auto()
    solid = auto()


class Shape(AutoNumber):
    diamond = auto()
    oval = auto()
    squiggle = auto()