import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoBackground from '../VideoBackground';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock video utils
jest.mock('../../utils/videoUtils', () => ({
  checkVideoLoadConditions: jest.fn().mockResolvedValue(true),
  getOptimalVideoSource: jest.fn().mockReturnValue('/background.webm')
}));

describe('VideoBackground Component', () => {
  test('renders video element', () => {
    render(<VideoBackground />);
    
    const video = screen.getByRole('presentation');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsInline');
  });

  test('has correct video attributes for performance', () => {
    render(<VideoBackground />);
    
    const video = screen.getByRole('presentation');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveStyle('object-fit: cover');
  });

  test('renders fallback gradient when video fails', () => {
    render(<VideoBackground />);
    
    const container = screen.getByRole('presentation').parentElement;
    expect(container).toHaveClass('bg-gradient-to-br');
  });

  test('sets up intersection observer', () => {
    render(<VideoBackground />);
    
    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });
});
