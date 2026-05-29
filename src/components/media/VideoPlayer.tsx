import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      {/* Video thumbnail (shown until play button is clicked) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10">
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 transform hover:scale-105"
              aria-label="Play video"
            >
              <Play size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      )}
      
      {/* Video player */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full aspect-video object-cover"
        playsInline
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Video controls (visible when video is playing) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={toggleMute}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;