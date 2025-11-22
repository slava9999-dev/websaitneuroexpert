// Video utility functions for optimized video loading
export const videoUtils = {
  // Get optimal video source - simplified
  getOptimalVideoSource: (isMobile) => {
    const sources = [];
    
    // Primary source - local WebM file with correct path
    sources.push({
      src: '/background.webm',
      type: 'video/webm'
    });
    
    // Fallback - public MP4 for testing
    sources.push({
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    });
    
    return sources;
  },

  // Check network conditions - simplified
  getNetworkCondition: () => {
    if (!navigator.connection) return 'fast';
    
    const { effectiveType, saveData } = navigator.connection;
    
    if (saveData) return 'data-saver';
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    
    return 'fast';
  },

  // Simple check for video load conditions
  checkVideoLoadConditions: async () => {
    const networkCondition = videoUtils.getNetworkCondition();
    
    // Don't load on slow networks
    if (networkCondition === 'data-saver' || networkCondition === 'slow') {
      return false;
    }

    return true;
  }
};