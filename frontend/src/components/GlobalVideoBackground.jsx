import React from 'react';

const GlobalVideoBackground = () => {
  // Состояние удалено: видео всегда отображается

  return (
    <>
      {/* Optimized Cloudinary Video Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0b0f17] z-0">
        <video poster="/video-poster.svg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onEnded={e => e.currentTarget.play()}
          style={{transform: 'scale(1.05)', objectPosition: 'center center'}}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          {/* Локальный зацикленный фон-видео */}
          <source src="/background.webm" type="video/webm" />
          {/* При необходимости добавьте mp4 в public и раскомментируйте */}
          {/* <source src="/background.mp4" type="video/mp4" /> */}
        </video>
      </div>
    </>
  );
};

export default GlobalVideoBackground;
