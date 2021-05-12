from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

from game.setgame import Game


async def homepage(request):
    game = Game()
    game.start()

    return JSONResponse(game.board)

app = Starlette(debug=True, routes=[
    Route('/', homepage)
])