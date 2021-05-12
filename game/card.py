from collections import namedtuple

from .attributes import Number, Color, Shading, Shape


class Card(namedtuple('Card', ['number', 'color', 'shading', 'shape'])):

    def to_vector(self):
        return [field.value for field in self]

    def to_dict(self):
        return {key: value.name for key, value in self._asdict().items()}

    def product(self, other):
        attrs = [2 * sum(attr) % 3 for attr in zip(self.to_vector(), other.to_vector())]
        return Card.create(*attrs)

    def __str__(self):
        return ' '.join(v.lower() for v in [
            self.number.name,
            self.color.name,
            self.shading.name,
            self.shape.name + ('' if self.number == Number.ONE else 's')
        ])

    @classmethod
    def create(cls, number, color, shading, shape):
        return cls(Number(number), Color(color), Shading(shading), Shape(shape))


if __name__ == '__main__':
    c = Card.create(1, 2, 1, 0)
    d = Card(Number.THREE, Color.BLUE, Shading.EMPTY, Shape.OVAL)

    print(c)
    print(d)

    print(c.product(d))