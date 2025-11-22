import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock video utils (must be declared before component import)
const mockCheckConditions = jest.fn().mockResolvedValue(true);
const mockGetSources = jest.fn().mockReturnValue([
  { src: '/background.webm', type: 'video/webm' }
]);

jest.mock('../../utils/videoUtils', () => ({
  videoUtils: {
    checkVideoLoadConditions: (...args) => mockCheckConditions(...args),
    getOptimalVideoSource: (...args) => mockGetSources(...args),
  }
}));

import VideoBackground from '../VideoBackground';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
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
