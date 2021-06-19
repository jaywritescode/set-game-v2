class Player:
  def __init__(self, name):
    self.name = name
    self.sets_found = list()

  def handle_set_found(self, cards):
    self.sets_found.append(cards)