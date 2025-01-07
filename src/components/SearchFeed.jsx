import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { Search } from '../assets/icons';
import useScrollToTop from '../hooks/useScrollToTop';

const SearchFeed = () => {
  useScrollToTop();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFromAPI(`search?query=${searchTerm}`)
      .then((data) => {
        if (data.data) {
          setVideos(data.data);
        } else {
          setError('No results found');
        }
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm]);

  const renderVideoCard = (video) => {
    if (!video?.videoId) return null;

    return (
      <div key={video.videoId} className="flex flex-col sm:flex-row gap-4 bg-black/5 dark:bg-dark-100/50 hover:bg-black/10 dark:hover:bg-dark-100 rounded-xl p-4 transition-all duration-300">
        {/* Thumbnail Section */}
        <Link to={`/video/${video.videoId}`} className="relative group sm:w-[360px] aspect-video rounded-xl overflow-hidden bg-black/10 dark:bg-dark-200">
          <img 
            src={video.thumbnail?.[video.thumbnail.length - 1]?.url || video.thumbnail?.[0]?.url} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {video.lengthText && (
            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
              {video.lengthText}
            </span>
          )}
        </Link>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <Link to={`/video/${video.videoId}`}>
            <h3 className="text-lg font-semibold text-dark-100 dark:text-white line-clamp-2 mb-2 hover:text-primary transition-colors">
              {video.title}
            </h3>
          </Link>

          <div className="flex flex-col gap-2 text-sm text-dark-100/60 dark:text-white/60">
            <div className="flex items-center gap-2">
              {video.viewCount && (
                <>
                  <span>{parseInt(video.viewCount).toLocaleString()} views</span>
                  <span className="w-1 h-1 bg-black/30 dark:bg-white/30 rounded-full"></span>
                </>
              )}
              {video.publishedTimeText && (
                <span>{video.publishedTimeText}</span>
              )}
            </div>

            {video.channelTitle && (
              <Link 
                to={`/channel/${video.channelId}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                {video.channelThumbnail?.[0]?.url && (
                  <img 
                    src={video.channelThumbnail[0].url}
                    alt={video.channelTitle}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>{video.channelTitle}</span>
              </Link>
            )}

            {video.description && (
              <p className="text-dark-100/50 dark:text-white/50 line-clamp-2 mt-2 transition-colors">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[95vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[95vh] text-dark-100/70 dark:text-white/70">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <Link to="/" className="text-primary hover:text-primary/80">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[95vh] bg-white dark:bg-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <h2 className="text-2xl font-bold text-dark-100 dark:text-white mb-6 transition-colors">
          Search Results for: <span className="text-primary">{searchTerm}</span>
        </h2>
        <div className="space-y-4">
          {videos.length > 0 ? (
            videos.map(renderVideoCard)
          ) : (
            <div className="text-center py-20 text-dark-100/70 dark:text-white/70">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFeed; 