import React from 'react';

import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';

const renderWithProvider = (component) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('App', () => {
  it('renders App component. Check if Layout', async () => {
    const { getByText } = renderWithProvider(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    const ButtonElements = screen.getByText('Products');

    expect(ButtonElements).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  test('renders Catalog content', async () => {
    const { getByText } = renderWithProvider(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      const catalogElement = screen.getByText(/Categories:/i);
      expect(catalogElement).toBeInTheDocument();
    });
  });

  test('renders Catalog content. Categories', async () => {
    const { getByText } = renderWithProvider(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      const categoryElements = screen.getAllByText(/X/i);
      const categoryElementNumber = categoryElements.length;
      const categoryElement = categoryElements[0];
      console.log('got', categoryElementNumber, 'categories');
      expect(categoryElement).toBeInTheDocument();
    });
  });

  test('renders Catalog content. Adding Category', async () => {
    const { getByText } = renderWithProvider(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      const categoryElements = screen.getAllByText(/X/i);
      const categoryElementNumber = categoryElements.length;
      console.log('got', categoryElementNumber, 'categories');
      const addCategoryBtn = screen.getByText('+');
      userEvent.click(addCategoryBtn);
      const input = screen.getByRole('textbox');
      userEvent.type(input, 'Fancy');
      waitFor(() => {
        promise;
        const categoryElementNumberRefresh = screen.queryAllByText(/X/i);
        const categoryElementNumberNew = categoryElementNumberRefresh.length;
        console.log(
          'got',
          categoryElementNumberNew - categoryElementNumber,
          'categories',
        );
        expect(categoryElementNumberNew - categoryElementNumber).toBe(1);
        const newCategory = categoryElementNumberRefresh[categoryElementNumber];
        expect(newCategory.textContent).toBe('Fancy');
      });
    });
  });
});
