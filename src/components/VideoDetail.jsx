import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { ThumbUp, Download } from '../assets/icons.jsx';
import useScrollToTop from '../hooks/useScrollToTop';

const VideoDetail = () => {
  useScrollToTop();
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { id } = useParams();
  const [downloadData, setDownloadData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState(null);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Reset playback time when video ID changes
  useEffect(() => {
    setPlayedSeconds(0);
    setPlaying(true);
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchFromAPI(`video/info?id=${id}`).then((data) => {
      console.log('Video Info:', data);
      setVideoDetail(data);
    });

    fetchFromAPI(`related?id=${id}`).then((data) => {
      console.log('Related Videos:', data);
      setVideos(data.data || []);
    });
  }, [id]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`https://yt-api.p.rapidapi.com/dl?id=${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
          'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST
        }
      });
      const data = await response.json();
      
      // Extract available formats with quality labels
      const availableFormats = data.formats?.filter(f => f.qualityLabel) || [];
      setDownloadUrls(availableFormats);
      setShowQualityOptions(true);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleQualitySelect = (format) => {
    if (format?.url) {
      window.open(format.url, '_blank');
    }
    setShowQualityOptions(false);
  };

  if (!videoDetail) {
    return (
      <div className="flex items-center justify-center min-h-[95vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { title, channelId, channelTitle, description, viewCount, likeCount } = videoDetail;

  const renderVideoPlayer = () => (
    <ReactPlayer
      key={id}
      url={`https://www.youtube.com/watch?v=${id}`}
      className="react-player"
      controls
      width="100%"
      height="100%"
      playing={playing}
      onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      progressInterval={500}
    />
  );

  return (
    <div className="flex flex-col min-h-[95vh] bg-white dark:bg-dark transition-colors">
      {/* Fixed Header Space */}
      <div className="h-[50px]" />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Video Player - Fixed on mobile */}
        <div className="fixed top-[50px] left-0 right-0 z-20 bg-white dark:bg-dark transition-colors">
          <div className="w-full aspect-video bg-black">
            {isMobile && renderVideoPlayer()}
          </div>
        </div>

        {/* Content pushed down on mobile */}
        <div className="mt-[47.25vw]">
          <div className="bg-white dark:bg-dark transition-colors">
            <VideoContent 
              title={title}
              channelId={channelId}
              channelTitle={channelTitle}
              description={description}
              viewCount={viewCount}
              likeCount={likeCount}
              isDescriptionOpen={isDescriptionOpen}
              setIsDescriptionOpen={setIsDescriptionOpen}
              isMobile={true}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              downloadUrls={downloadUrls}
              showQualityOptions={showQualityOptions}
              onQualitySelect={handleQualitySelect}
              setShowQualityOptions={setShowQualityOptions}
            />
            <div className="mt-4 px-4">
              <h3 className="text-xl font-bold text-dark-100 dark:text-white mb-6 pb-4 border-b border-black/10 dark:border-white/10 transition-colors">
                Related Videos
              </h3>
              <div className="space-y-4">
                <Videos videos={videos} direction="column" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-4 md:px-8">
        <div className="max-w-[2000px] mx-auto flex gap-6">
          {/* Main Content */}
          <div className="flex-1 max-w-[calc(100%-400px)]">
            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
              {!isMobile && renderVideoPlayer()}
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <VideoContent 
                title={title}
                channelId={channelId}
                channelTitle={channelTitle}
                description={description}
                viewCount={viewCount}
                likeCount={likeCount}
                isDescriptionOpen={isDescriptionOpen}
                setIsDescriptionOpen={setIsDescriptionOpen}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                downloadUrls={downloadUrls}
                showQualityOptions={showQualityOptions}
                onQualitySelect={handleQualitySelect}
                setShowQualityOptions={setShowQualityOptions}
              />
            </div>
          </div>

          {/* Related Videos */}
          <div className="w-[400px] flex-shrink-0">
            <div className="sticky top-[66px] p-6 bg-black/5 dark:bg-dark-100 rounded-xl transition-colors">
              <h3 className="text-xl font-bold text-dark-100 dark:text-white mb-6 pb-4 border-b border-black/10 dark:border-white/10 transition-colors">
                Related Videos
              </h3>
              <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[calc(100vh-220px)]">
                <Videos videos={videos} direction="column" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// VideoContent Component
const VideoContent = ({ 
  title, 
  channelId, 
  channelTitle, 
  description, 
  viewCount, 
  likeCount,
  isDescriptionOpen,
  setIsDescriptionOpen,
  isMobile = false,
  onDownload,
  isDownloading,
  downloadUrls,
  showQualityOptions,
  onQualitySelect,
  setShowQualityOptions
}) => (
  <div className={`bg-black/5 dark:bg-dark-100/80 rounded-xl shadow-xl overflow-hidden transition-colors ${isMobile ? 'rounded-none shadow-none bg-transparent mt-0' : ''}`}>
    <div className={`${isMobile ? 'p-2 pt-0' : 'p-6 md:p-8'} ${isMobile ? 'space-y-3' : 'space-y-6'}`}>
      <h1 className={`${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-dark-100 dark:text-white transition-colors`}>{title}</h1>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link 
          to={`/channel/${channelId}`}
          className="hover:scale-105 transition-transform"
        >
          <h2 className="text-lg font-medium text-dark-100/90 dark:text-white/90 hover:text-primary transition-colors">
            {channelTitle}
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-dark-200 rounded-full text-dark-100/70 dark:text-white/70 text-sm transition-colors">
            <span>{parseInt(viewCount).toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-dark-200 rounded-full text-dark-100/70 dark:text-white/70 text-sm transition-colors">
            <ThumbUp className="w-4 h-4" />
            <span>{parseInt(likeCount).toLocaleString()}</span>
          </div>
          <div className="relative">
            <button
              onClick={onDownload}
              disabled={isDownloading}
              className={`
                flex items-center gap-2 px-3 py-1.5 
                bg-gradient-to-r from-primary/20 to-secondary/20 
                hover:from-primary/30 hover:to-secondary/30
                rounded-full text-dark-100/90 dark:text-white/90 text-sm
                transition-all duration-300
                ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-black/30 dark:border-white/30 border-t-black/90 dark:border-t-white/90 rounded-full animate-spin transition-colors" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? 'Loading...' : 'Download'}</span>
            </button>

            {/* Quality Options Dropdown */}
            {showQualityOptions && downloadUrls && (
              <div className="absolute top-full right-0 mt-2 py-2 w-48 bg-white dark:bg-dark-100 rounded-xl shadow-xl z-50 transition-colors">
                <div className="px-4 py-2 text-sm text-black/50 dark:text-white/50 border-b border-black/10 dark:border-white/10 transition-colors">
                  Select Quality
                </div>
                {downloadUrls.map((format, index) => (
                  <button
                    key={index}
                    onClick={() => onQualitySelect(format)}
                    className="w-full px-4 py-2 text-sm text-dark-100/90 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    {format.qualityLabel} ({Math.round(format.contentLength / 1024 / 1024)}MB)
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Collapsible Description */}
      <div 
        className="relative bg-black/5 dark:bg-dark-200 rounded-xl overflow-hidden transition-all duration-300"
        style={{ maxHeight: isDescriptionOpen ? '1000px' : '100px' }}
      >
        <div className={`${isMobile ? 'p-3' : 'p-6'}`}>
          <p className="text-dark-100/70 dark:text-white/70 whitespace-pre-wrap leading-relaxed text-sm transition-colors">
            {description}
          </p>
        </div>
        
        {/* Gradient Overlay and Show More Button */}
        <div 
          className={`absolute bottom-0 left-0 right-0 flex flex-col items-center ${
            isDescriptionOpen ? 'pb-4' : 'pb-0'
          }`}
        >
          {!isDescriptionOpen && (
            <div className="w-full h-16 bg-gradient-to-t from-black/5 dark:from-dark-200 to-transparent transition-colors" />
          )}
          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className={`
              group relative px-6 py-2.5 
              ${isDescriptionOpen ? 'mt-4' : '-mt-8'} 
              rounded-full font-medium text-sm
              bg-gradient-to-r from-primary/10 to-secondary/10
              hover:from-primary/20 hover:to-secondary/20
              border border-primary/20 hover:border-primary/40
              transition-all duration-300 ease-out
              text-dark-100/90 dark:text-white/90 hover:text-dark-100 dark:hover:text-white
              shadow-lg shadow-primary/5 hover:shadow-primary/10
              backdrop-blur-sm
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isDescriptionOpen ? 'Show Less' : 'Show More'}
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDescriptionOpen ? 'rotate-180' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default VideoDetail; 