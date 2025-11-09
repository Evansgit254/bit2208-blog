import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with typed query', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(input, { target: { value: 'test' } });

    // debounce is 250ms; wait a bit
    await new Promise((r) => setTimeout(r, 300));
    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
