import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import worker from './mocks/browser';
import App from './App';

before(() => {
  worker.start();
});

after(() => {
  worker.stop();
});

describe('<App>', () => {
  afterEach(() => {
    worker.resetHandlers();
  });

  it('creates a new game', async () => {
    const { getByRole, findByTestId } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });

    userEvent.click(createGameButton);
    const roomCodeElement = await findByTestId('room-code');

    expect(roomCodeElement.textContent).to.contain('aaaa');
  });
});
