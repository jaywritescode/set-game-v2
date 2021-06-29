import pytest
from starlette.testclient import TestClient
from urllib.parse import quote

from web.api import app
from game.setgame import Game


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
        test_client.app.state.GAMES = dict()


def test_create(client):
    response = client.post("/create")

    room_code = response.json().get("room")
    assert room_code is not None
    assert isinstance(app.state.GAMES[room_code], Game)


def test_join_success(client):
    room_code = "abcd"
    app.state.GAMES[room_code] = Game()

    response = client.get(f"/join?room={room_code}")
    assert response.json() == {"room": room_code}


def test_join_failure(client):
    response = client.get(f"/join?room=abcd")
    assert response.status_code == 404


def test_start_success(client):
    response = client.post("/create")
    room_code = response.json().get("room")

    response = client.get(f"/{room_code}/start")
    body = response.json()

    assert body.get("type") == "start-game"
    assert body.get("payload")
    # TODO: assert body.get('payload') matches expected schemas


def test_add_player(client):
    room_code = "abcd"
    app.state.GAMES[room_code] = Game()

    name = "Tim"
    response = client.post(f"/{room_code}/add_player?name={name}")
    assert response.json() == { 'name': name }