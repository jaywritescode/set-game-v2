import json
import logging
import os
import random
import string

from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocketDisconnect

from game.setgame import Game
from web.serialize import serialize_board, as_card

logger = logging.getLogger('app.api')

async def homepage(request):
    with open(os.path.join(os.path.dirname(__file__), 'app', 'build/index.html')) as file:
        return HTMLResponse(file.read())


async def create(request):
    room = generate_room_id()
    logger.info("Generating room: %s", room)
    app.state.GAMES[room] = Game()
    return JSONResponse({ 'room': room })


def generate_room_id():
    while True:
        room_id = ''.join(random.choices(string.ascii_lowercase, k=4))
        if room_id not in app.state.GAMES:
            return room_id


async def start(request):
    if not hasattr(app.state, 'GAME'):
        app.state.GAME = Game()
        app.state.GAME.start()

    return JSONResponse(serialize_board(app.state.GAME))


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
    Route('/start', start),
    Route('/create', create, methods=['POST']),
    WebSocketRoute('/ws', websocket_endpoint),
])
app.state.GAMES = dict()