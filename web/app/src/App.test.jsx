import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('does something', () => {
    const { getByRole } = render(<App />);
    const createGameButton = getByRole('button', { name: 'create new game' });
    expect(document.body.contains(createGameButton));
  });
});