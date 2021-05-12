import uvicorn
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

from game.setgame import Game


async def homepage(request):
    if not hasattr(app.state, 'GAME'):
        print("starting a new game")
        app.state.GAME = Game()
        app.state.GAME.start()

    return JSONResponse([card.to_dict() for card in app.state.GAME.board])

app = Starlette(debug=True, routes=[
    Route('/', homepage)
])


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)
