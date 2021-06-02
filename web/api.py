import json
import logging
import os
import random
import string

from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse, Response
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocketDisconnect

from game.card import Card
from game.setgame import Game
from web.serialize import CardSchema, GameSchema

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger = logging.getLogger(__name__)
logger.addHandler(ch)
logger.setLevel(logging.DEBUG)


async def homepage(request):
    with open(os.path.join(os.path.dirname(__file__), 'app', 'build/index.html')) as file:
        return HTMLResponse(file.read())


async def create(request):
    room = generate_room_id()

    game = Game()
    app.state.GAMES[room] = game
    game.start()

    return JSONResponse({ 'room': room })


async def join(request):
    room = request.query_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    return JSONResponse({ 'room': room })


async def start(request):
    room = request.path_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    schema = GameSchema()
    return JSONResponse({
        'type': 'start-game',
        'payload': schema.dump(app.state.GAMES[room])
    })


def generate_room_id():
    while True:
        room_id = ''.join(random.choices(string.ascii_lowercase, k=4))
        if room_id not in app.state.GAMES:
            return room_id


async def websocket_endpoint(websocket):
    await websocket.accept()
    room = websocket.path_params['room']

    try:
        while True:
            assert room in app.state.GAMES

            data = await websocket.receive_json()

            cards = CardSchema(many=True).load(data['cards'])
            game = app.state.GAMES[room]

            result = game.receive_set(cards)
            await websocket.send_json({
                'type': 'set-found',
                'payload': GameSchema().dump(result),
            })
    except WebSocketDisconnect as e:
        if e.code == 1000:
            print(f"Disconnected with code: {e.code}")
        else:
            print(f"Disconnected with code: {e.code}")
    else:
        await websocket.close()


app = Starlette(debug=True, routes=[
    Route('/', homepage),
    Route('/start/{room}', start),
    Route('/create', create, methods=['POST']),
    Route('/join', join),
    WebSocketRoute('/ws/{room}', websocket_endpoint),
])
app.state.GAMES = dict()