import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { rest, setupWorker } from 'msw';
import App from './App';

const ROOM = 'aaaa';
const worker = setupWorker(
  rest.post('/api/create', (req, res, ctx) => {
    return res(ctx.json({ room: ROOM }));
  }),

  rest.get('/api/join', (req, res, ctx) => {
    return res(ctx.json({ room: req.url.searchParams.get('room') }));
  }),
);

before(() => worker.start());
afterEach(() => worker.resetHandlers());

describe('<App>', () => {
  it('creates a new game', async () => {
    const { getByRole, findByTestId } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });

    userEvent.click(createGameButton);
    const roomCodeElement = await findByTestId('room-code');

    expect(roomCodeElement.textContent).to.contain(ROOM);
  });

  it('joins a game', async () => {
    const { getByRole, getByPlaceholderText, findByTestId } = render(<App />);
    const joinGameButton = getByRole('button', { name: 'join game' });
    const roomCodeInput = getByPlaceholderText(/room code/i, { selector: 'input' });

    userEvent.type(roomCodeInput, ROOM);
    userEvent.click(joinGameButton);
    const roomCodeElement = await findByTestId('room-code');

    expect(roomCodeElement.textContent).to.contain(ROOM);
  });
});
