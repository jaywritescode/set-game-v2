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
from web.serialize import CardSchema, GameSchema, PlayerSchema

logger = logging.getLogger(__name__)
formatter = logging.Formatter('%(levelname)s: %(name)s: %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


async def homepage(request):
    with open(os.path.join(os.path.dirname(__file__), 'app', 'build/index.html')) as file:
        return HTMLResponse(file.read())


async def create(request):
    logger.debug(f'[create] called by {request.client.host}:{request.client.port}')

    room = generate_room_id()

    game = Game()
    app.state.GAMES[room] = game
    game.start()

    return JSONResponse({ 'room': room })


async def join(request):
    logger.debug(f'[join] called by {request.client.host}:{request.client.port} on room: {request.query_params["room"]}')

    room = request.query_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    return JSONResponse({ 'room': room })


async def find(request):
    """
    Finds a set on the board. Useful for testing.
    """
    room = request.path_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    schema = CardSchema(many=True)
    return JSONResponse(schema.dump(app.state.GAMES[room].find_set()))


async def start(request):
    logger.debug(f'[start] called by {request.client.host}:{request.client.port} on room: {request.path_params["room"]}')

    room = request.path_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    schema = GameSchema()
    return JSONResponse({
        'type': 'start-game',
        'payload': schema.dump(app.state.GAMES[room])
    })


async def add_player(request):
    room = request.path_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)
    game = app.state.GAMES[room]

    name = request.query_params['name']
    nanoid = request.query_params['id']

    game.add_player(name, nanoid)

    schema = PlayerSchema(many=True)
    return JSONResponse({ 'name': name, 'id': nanoid })


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
    Route('/{room}/start', start),
    Route('/create', create, methods=['POST']),
    Route('/join', join),
    Route('/find/{room}', find),
    Route('/{room}/add_player', add_player, methods=['POST']),
    WebSocketRoute('/ws/{room}', websocket_endpoint),
])
app.state.GAMES = dict()