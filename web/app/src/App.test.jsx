import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('creates a new game', () => {
    const { getByRole } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });

    userEvent.click(createGameButton);
    expect(document.body.contains(createGameButton));
  });
});