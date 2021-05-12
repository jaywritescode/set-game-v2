from enum import Enum, auto


class AutoNumber(Enum):
    """
    Index the enums representing attributes starting at zero.
    """
    def _generate_next_value_(name, start, count, last_values):
        return count


class Number(AutoNumber):
    ONE = auto()
    TWO = auto()
    THREE = auto()


class Color(AutoNumber):
    RED = auto()
    BLUE = auto()
    GREEN = auto()


class Shading(AutoNumber):
    EMPTY = auto()
    STRIPED = auto()
    SOLID = auto()


class Shape(AutoNumber):
    DIAMOND = auto()
    OVAL = auto()
    SQUIGGLE = auto()