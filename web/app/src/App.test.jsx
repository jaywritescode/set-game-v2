import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders create new game button', () => {
    const { getByRole } = render(<App />);
    getByRole('button', { name: /create new game/i });
  });
});