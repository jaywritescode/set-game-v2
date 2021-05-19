import json

from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse
from starlette.routing import Route

from game.setgame import Game
from web.serialize import serialize_board, as_card


async def homepage(request):
    return HTMLResponse('<html>hello world</html>')


async def start(request):
    if not hasattr(app.state, 'GAME'):
        app.state.GAME = Game()
        app.state.GAME.start()

    return JSONResponse(serialize_board(app.state.GAME))


# This will have to be a websocket route eventually, I think.
async def submit(request):
    submission = await request.body()

    result = app.state.GAME.receive_set(json.loads(submission, object_hook=as_card))
    return JSONResponse(serialize_board(app.state.GAME) if result else dict())

app = Starlette(debug=True, routes=[
    Route('/', homepage),
    Route('/start', start),
    Route('/submit', endpoint=submit, methods=['PUT'])
])