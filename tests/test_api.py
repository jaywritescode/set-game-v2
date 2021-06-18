from starlette.testclient import TestClient

from web.api import app
from game.setgame import Game

def test_create():
  client = TestClient(app)
  response = client.post('/create')

  room_code = response.json().get('room')
  assert room_code is not None
  assert isinstance(app.state.GAMES[room_code], Game)
