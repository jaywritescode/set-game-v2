import json
import logging
import os
import random
import string

import orjson
from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse, RedirectResponse, Response
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocketDisconnect

from game.setgame import Game
from web.serialize import serialize_board, as_card

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
    app.state.GAMES[room] = Game()
    return JSONResponse({ 'room': room })

async def join(request):
    room = request.query_params['room']
    if room in app.state.GAMES:
        return RedirectResponse(url=f"/api/start/{room}")
    else:
        return Response(status_code=404)


def generate_room_id():
    while True:
        room_id = ''.join(random.choices(string.ascii_lowercase, k=4))
        if room_id not in app.state.GAMES:
            return room_id


async def start(request):
    room = request.path_params['room']
    if room not in app.state.GAMES:
        return Response(status_code=404)

    game = app.state.GAMES[room]
    game.start()

    return JSONResponse(serialize_board(game))


async def websocket_endpoint(websocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()
            result = app.state.GAME.receive_set(json.loads(data, object_hook=as_card))
            await websocket.send_json(serialize_board(app.state.GAME) if result else dict())
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