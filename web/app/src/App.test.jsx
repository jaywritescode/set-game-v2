import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders create new game button', () => {
    const { getByRole } = render(<App />);
    getByRole('button', { name: /create new game/i });
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