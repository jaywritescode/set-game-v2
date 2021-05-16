import uvicorn
from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse, Response
from starlette.routing import Route

from game.setgame import Game


async def homepage(request):
    return HTMLResponse('<html>hello world</html>')


async def start(request):
    if not hasattr(app.state, 'GAME'):
        app.state.GAME = Game()
        app.state.GAME.start()

    return JSONResponse([card.to_dict() for card in app.state.GAME.board])


# This will have to be a websocket route eventually, I think.
async def submit(request):
    return Response(status_code=204)

app = Starlette(debug=True, routes=[
    Route('/', homepage),
    Route('/start', start),
    Route('/submit', endpoint=submit, methods=['PUT'])
])