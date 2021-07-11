import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  describe('create game button', () => {
    it('requests a new game', () => {
      const { getByRole } = render(<App />);
      const createButton = getByRole('button', { name: /create new game/i });

      userEvent.click(createGameButton);
    });
  });

  describe('join game button', () => {
    it('is disabled', () => {
      const { getByRole } = render(<App />);
      const joinButton = getByRole('button', { name: /join game/i });
      expect(joinButton.disabled).to.be.ok;
    });

    it('is enabled with a valid room code', () => {
      const { getByRole } = render(<App />);
      const joinButton = getByRole('button', { name: /join game/i });

      userEvent.type(getByRole('textbox', { name: /room code/i }), 'abcd');
      expect(joinButton.disabled).to.be.false;
    });
  });
});