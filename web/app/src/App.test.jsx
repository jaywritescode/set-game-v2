import * as React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('<App>', () => {
  it('renders create new game button', () => {
    const { getByRole } = render(<App />);
    getByRole('button', { name: /create new game/i });
  });

  it('renders join game button', () => {
    const { getByRole } = render(<App />);
    getByRole('button', { name: /join game/i });
  });
});