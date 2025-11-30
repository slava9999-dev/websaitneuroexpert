import React, { useState, useEffect, useRef, useCallback } from 'react';
import { videoUtils } from '../utils/videoUtils';

/**
 * Упрощенный видео фон с надежной работой
 */
const VideoBackground = ({ onVideoLoad }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check video load conditions
  useEffect(() => {
    let mounted = true;
    const checkConditions = async () => {
      try {
        const shouldLoad = await videoUtils.checkVideoLoadConditions();
        if (mounted) setShouldLoadVideo(shouldLoad);
      } catch (error) {
        console.warn('Error checking video conditions:', error);
        if (mounted) setShouldLoadVideo(true); // Default to loading
      }
    };
    checkConditions();
    return () => { mounted = false; };
  }, []);

  // Video event handlers
  const handleVideoLoad = useCallback(() => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
    if (onVideoLoad) onVideoLoad();
  }, [onVideoLoad]);

  const handleVideoError = useCallback((error) => {
    console.error('Video error:', error);
    setVideoError(true);
    setVideoLoaded(false);
  }, []);

  // Try to play video when loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    const playVideo = async () => {
      try {
        await video.play();
        console.log('Video playing successfully');
      } catch (error) {
        console.warn('Autoplay failed:', error);
        // This is normal for many browsers - video will play on user interaction
      }
    };

    playVideo();
  }, [videoLoaded]);

  // Fallback rendering
  const renderFallback = () => (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-[#0b0f17]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0b0f17]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0f17]/30 to-[#0b0f17]/80" />
    </div>
  );

  if (!shouldLoadVideo || videoError) {
    return renderFallback();
  }

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden bg-[#0b0f17] z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        poster="/video-poster.svg"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        style={{
          transform: 'scale(1.05)',
          objectPosition: 'center center',
          objectFit: 'cover',
        }}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-80' : 'opacity-0'
        }`}
      >
        {videoUtils.getOptimalVideoSource(isMobile).map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f17]/70 via-[#0b0f17]/50 to-[#0b0f17]/70" />

      {/* Loading indicator */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
