import json
import logging
import os
import random
import string

from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse, Response
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocketDisconnect

from game.setgame import Game, GameSchema
from web.serialize import as_card

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
    return JSONResponse(schema.dump(app.state.GAMES[room]))


def generate_room_id():
    while True:
        room_id = ''.join(random.choices(string.ascii_lowercase, k=4))
        if room_id not in app.state.GAMES:
            return room_id


async def websocket_endpoint(websocket):
    await websocket.accept()

    try:
        while True:
            data = json.loads(await websocket.receive_json(), object_hook=as_card)

            room = data['room']
            assert room in app.state.GAMES

            cards = data['cards']
            game = app.state.GAMES[room]

            result = game.receive_set(cards)
            schema = GameSchema()
            await websocket.send_json(schema.dump(result))
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
    WebSocketRoute('/ws', websocket_endpoint),
])
app.state.GAMES = dict()