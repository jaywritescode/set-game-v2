import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders learn react link', () => {
    const { getByText } = render(<App />);
    const buttonElement = getByText(/create new game/i);
    expect(document.body.contains(buttonElement));
  });
});