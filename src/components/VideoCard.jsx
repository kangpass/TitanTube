import { Link } from 'react-router-dom';
import { CheckCircle } from '../assets/icons';

const VideoCard = ({ video }) => {
  if (!video?.videoId || !video?.title) return null;

  // Handle different thumbnail structures
  const thumbnailUrl = video.thumbnail?.[0]?.url || 
                      video.thumbnails?.default?.url || 
                      video.thumbnails?.[0]?.url ||
                      `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;

  return (
    <div className="video-card group h-full bg-white dark:bg-dark-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <Link to={`/video/${video.videoId}`} className="relative block aspect-video overflow-hidden bg-gray-100 dark:bg-black/10">
        <img 
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {video.lengthText && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            {video.lengthText}
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <Link to={`/video/${video.videoId}`} className="block mb-2">
          <h3 className="text-dark-100 dark:text-white font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>
        
        {video.channelId && (
          <Link to={`/channel/${video.channelId}`} className="flex items-center gap-2 mb-1">
            <span className="text-dark-100/70 dark:text-white/70 text-sm flex items-center hover:text-primary transition-colors">
              {video.channelTitle}
              <CheckCircle className="w-3 h-3 ml-1 text-primary" />
            </span>
          </Link>
        )}
        
        <div className="text-dark-100/60 dark:text-white/60 text-sm flex items-center gap-2">
          {video.viewCount && (
            <>
              <span>{parseInt(video.viewCount).toLocaleString()} views</span>
              <span className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full"></span>
            </>
          )}
          <span>{video.publishedTimeText || video.publishedText}</span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard; 