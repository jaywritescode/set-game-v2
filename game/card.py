import dataclasses

from .attributes import Number, Color, Shading, Shape


@dataclasses.dataclass(frozen=True)
class Card:
    number: Number
    color: Color
    shading: Shading
    shape: Shape

    def to_vector(self):
        return tuple(attr.value for attr in dataclasses.astuple(self))

    def product(self, other):
        attrs = [2 * sum(attr) % 3 for attr in zip(self.to_vector(), other.to_vector())]
        return Card.from_vector(*attrs)

    def __str__(self):
        return ' '.join(v.lower() for v in [
            self.number.name,
            self.color.name,
            self.shading.name,
            self.shape.name + ('' if self.number == Number.ONE else 's')
        ])

    @classmethod
    def from_vector(cls, number, color, shading, shape):
        return cls(Number(number), Color(color), Shading(shading), Shape(shape))

    @classmethod
    def from_str(cls, string):
        number, color, shading, shape = string.upper().split()
        if shape.endswith('S'):
            shape = shape[:-1]
        return cls(Number[number], Color[color], Shading[shading], Shape[shape])