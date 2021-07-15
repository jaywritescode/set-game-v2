import dataclasses
from typing import List
from uuid import uuid4

from .card import Card

@dataclasses.dataclass(frozen=True)
class Player:
    name: str
    uuid: str = dataclasses.field(default_factory=uuid4)
    sets_found: List[List[Card]] = dataclasses.field(default_factory=list)

    def handle_set_found(self, the_set):
        self.sets_found.append(the_set)