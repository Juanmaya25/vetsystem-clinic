import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App.jsx';

afterEach(cleanup);

describe('VetSystem App', () => {
  it('renders the clinic brand and dashboard greeting', () => {
    render(<App />);
    expect(screen.getByText('VetCare')).toBeInTheDocument();
    expect(screen.getByText(/Buenos días/)).toBeInTheDocument();
  });

  it('navigates to Pacientes and lists seeded pets', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Pacientes/ }));
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Luna')).toBeInTheDocument();
  });

  it('filters patients by search query', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Pacientes/ }));
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre, dueño o raza...'), { target: { value: 'Rocky' } });
    expect(screen.getByText('Rocky')).toBeInTheDocument();
    expect(screen.queryByText('Max')).not.toBeInTheDocument();
  });

  it('shows the pharmacy inventory with low-stock state', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Farmacia/ }));
    expect(screen.getByText('Frontline Spray')).toBeInTheDocument();
    expect(screen.getAllByText('Stock bajo').length).toBeGreaterThan(0);
  });

  it('toggles light/dark theme', () => {
    const { container } = render(<App />);
    const root = container.firstChild;
    const before = root.style.background;
    fireEvent.click(screen.getByRole('button', { name: 'Tema' }));
    expect(root.style.background).not.toBe(before);
  });
});
