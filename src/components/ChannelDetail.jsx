import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import useScrollToTop from '../hooks/useScrollToTop';

const ChannelDetail = () => {
  useScrollToTop();
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchFromAPI(`channel/home?id=${id}`);
        console.log('Channel Data:', data);

        if (data.meta) {
          setChannelDetail({
            id: data.meta.channelId,
            title: data.meta.title,
            description: data.meta.description,
            thumbnails: data.meta.avatar,
            subscriberCount: data.meta.subscriberCount,
            videoCount: data.meta.videoCount,
            bannerUrl: data.meta.banner?.[data.meta.banner.length - 1]?.url || data.meta.banner?.[0]?.url,
            handle: data.meta.channelHandle
          });
        }

        if (data.data) {
          // Filter out video listings and get all videos
          const allVideos = data.data.reduce((acc, item) => {
            if (item.type === 'video_listing') {
              return [...acc, ...item.data];
            } else if (item.type === 'video') {
              return [...acc, item];
            }
            return acc;
          }, []);
          setVideos(allVideos);
        }
      } catch (err) {
        console.error('Error fetching channel data:', err);
        setError('Failed to load channel data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[95vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[95vh] text-white/70">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <Link to="/" className="text-primary hover:text-primary/80">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!channelDetail) {
    return (
      <div className="flex items-center justify-center min-h-[95vh] text-white/70">
        <div className="text-center">
          <p className="text-xl mb-4">Channel not found</p>
          <Link to="/" className="text-primary hover:text-primary/80">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[95vh] bg-white dark:bg-dark transition-colors">
      {/* Channel Banner */}
      <div className="relative h-[200px] md:h-[300px] lg:h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${channelDetail.bannerUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-[2px]" />
        </div>
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl rounded-xl p-6 md:p-8 shadow-2xl border border-black/5 dark:border-white/5 transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Channel Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <img 
                src={channelDetail.thumbnails?.[channelDetail.thumbnails.length - 1]?.url} 
                alt={channelDetail.title}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-dark object-cover transition-colors"
              />
            </div>

            {/* Channel Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-dark-100 dark:text-white transition-colors">
                  {channelDetail.title}
                </h1>
                <span className="text-primary/80 text-sm md:text-base">
                  {channelDetail.handle}
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-dark-100/70 dark:text-white/70 transition-colors mb-4">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-2xl font-bold text-dark-100 dark:text-white transition-colors">
                    {parseInt(channelDetail.subscriberCount).toLocaleString()}
                  </span>
                  <span className="text-sm">Subscribers</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-2xl font-bold text-dark-100 dark:text-white transition-colors">
                    {parseInt(channelDetail.videoCount).toLocaleString()}
                  </span>
                  <span className="text-sm">Videos</span>
                </div>
              </div>

              <p className="text-dark-100/60 dark:text-white/60 line-clamp-3 md:line-clamp-none max-w-3xl transition-colors">
                {channelDetail.description}
              </p>
            </div>
          </div>
        </div>

        {/* Channel Videos */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-dark-100 dark:text-white mb-6 px-2 transition-colors">
            Latest Videos
          </h2>
          <Videos videos={videos} layout="grid" />
        </div>
      </div>
    </div>
  );
};

export default ChannelDetail; 