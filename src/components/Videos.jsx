import { VideoCard, ChannelCard } from './';

const Videos = ({ videos, direction = "row" }) => {
  if(!videos?.length) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Filter out invalid videos
  const validVideos = videos.filter(item => {
    const videoData = item.video || item;
    return videoData && (videoData.videoId || videoData.channelId);
  });
  
  return (
    <div className={`grid w-full ${
      direction === "column" 
        ? 'grid-cols-1 gap-4'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
    }`}>
      {validVideos.map((item, idx) => {
        const videoData = item.video || item;
        const type = videoData.type || (videoData.channelId ? 'channel' : 'video');
        
        return (
          <div key={videoData.videoId || videoData.channelId || idx} 
               className={`w-full ${direction === "column" ? "" : "break-inside-avoid"}`}
          >
            {type === 'video' && <VideoCard video={videoData} />}
            {type === 'channel' && <ChannelCard channelDetail={videoData} />}
          </div>
        );
      })}
    </div>
  );
}

export default Videos; 