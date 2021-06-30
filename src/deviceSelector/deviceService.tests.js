import { render, screen } from '@testing-library/react';

test('returns list of devices', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
  