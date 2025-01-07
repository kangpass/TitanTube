import { Link } from "react-router-dom";
import { CheckCircle } from "../assets/icons";

const ChannelCard = ({ channelDetail, marginTop }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center text-white w-full ${
        marginTop ? `mt-[${marginTop}]` : ''
      }`}
    >
      <Link 
        to={`/channel/${channelDetail?.channelId}`}
        className="flex flex-col items-center"
      >
        <div className="w-44 h-44 rounded-full overflow-hidden mb-4 border-2 border-white/10 shadow-lg">
          <img 
            src={channelDetail?.thumbnail?.[0]?.url || channelDetail?.thumbnails?.default?.url} 
            alt={channelDetail?.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {channelDetail?.title}
            <CheckCircle className="w-4 h-4 text-primary" />
          </h2>
          
          {channelDetail?.subscriberCount && (
            <p className="text-sm text-white/70">
              {parseInt(channelDetail?.subscriberCount).toLocaleString()} Subscribers
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ChannelCard; 