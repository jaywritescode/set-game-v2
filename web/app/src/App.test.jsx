import * as React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { rest, setupWorker } from 'msw';
import App from './App';

const worker = (window.worker = setupWorker(
  rest.post('/api/create', (req, res, ctx) => {
    return res(ctx.json({ room: 'abcd' }));
  }),

  rest.get('/api/join', (req, res, ctx) => {
    return res(ctx.json({ room: req.url.searchParams.get('room') }));
  }),

  rest.post('/api/*/add_player', (req, res, ctx) => {
    return res(ctx.json({
      name: req.url.searchParams.get('name'),
      id: req.url.searchParams.get('id')
    }));
  })
));

describe('<App>', () => {
  before(function (done) {
    worker.start().then(() => setTimeout(done, 1000));
  });

  describe('create game button', () => {
    it('requests a new game', async () => {
      const { getByRole, findByLabelText } = render(<App />);
      const createButton = getByRole('button', { name: /create new game/i });

      act(() => userEvent.click(createButton));
      const nameInput = await findByLabelText(/who are you/i);
    });
  });

  describe('join game button', () => {
    it('is disabled', () => {
      const { getByRole } = render(<App />);
      const joinButton = getByRole('button', { name: /join game/i });
      expect(joinButton.disabled).to.be.ok;
    });

    it('is enabled with a valid room code', async () => {
      const { getByRole, findByLabelText } = render(<App />);
      const joinButton = getByRole('button', { name: /join game/i });

      userEvent.type(getByRole('textbox', { name: /room code/i }), 'abcd');
      expect(joinButton.disabled).to.be.false;

      act(() => userEvent.click(joinButton));
      await findByLabelText(/who are you/i);
    });
  });
});
