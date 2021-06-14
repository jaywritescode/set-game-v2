import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import worker from './mocks/browser';
import App from './App';

describe('<App>', () => {
  before(() => worker.start());

  afterEach(() => worker.resetHandlers());

  after(() => worker.stop());

  it('creates a new game', () => {
    const { getByRole } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });

    userEvent.click(createGameButton);
    expect(document.body.contains(createGameButton));
  });
});