import json
import os

from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocketDisconnect

from game.setgame import Game
from web.serialize import serialize_board, as_card


async def homepage(request):
    with open(os.path.join(os.path.dirname(__file__), 'app', 'build/index.html')) as file:
        return HTMLResponse(file.read())


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
    WebSocketRoute('/ws', websocket_endpoint),
])