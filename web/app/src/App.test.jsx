import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import worker from './mocks/browser';
import App from './App';

describe('<App>', () => {
  before(() => {
    worker.start({
      url: '../public/mockServiceWorker.js',
    });
  });

  afterEach(() => {
    worker.resetHandlers();
  });

  after(() => {
    worker.stop();
  });

  it('creates a new game', async () => {
    const { getByRole, findByTestId } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });

    userEvent.click(createGameButton);
    expect(await findByTestId('room-code')).to.contain('aaaa');
  });
});
