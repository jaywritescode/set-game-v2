import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App />', () => {
  it('renders "create new game" button', () => {
    const { getByRole } = render(<App />);
    const buttonElement = getByRole('button', { name: 'create new game' });
    expect(document.body).contains(buttonElement);
  });
});
