import { useState, useEffect, useCallback, useRef } from 'react';
import { Videos, Sidebar } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import useScrollToTop from '../hooks/useScrollToTop';

const searchTerms = [
  'Trending', 'Music', 'Gaming', 'Sports', 'News', 'Education',
  'Podcasts', 'Movies', 'Live', 'Coding', 'Fashion', 'Beauty',
  'Comedy', 'Tech', 'Food', 'Travel', 'Animals', 'Science'
];

const Feed = () => {
  useScrollToTop();
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedTerms, setUsedTerms] = useState([]);
  const loadingRef = useRef(false);

  // Get a random unused search term
  const getNextSearchTerm = useCallback(() => {
    if (selectedCategory !== 'Home') return selectedCategory;
    
    const availableTerms = searchTerms.filter(term => !usedTerms.includes(term));
    if (availableTerms.length === 0) {
      setUsedTerms([]);
      return searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }
    const nextTerm = availableTerms[Math.floor(Math.random() * availableTerms.length)];
    setUsedTerms(prev => [...prev, nextTerm]);
    return nextTerm;
  }, [usedTerms, selectedCategory]);

  const fetchVideos = useCallback(async (isInitial = false) => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const searchTerm = getNextSearchTerm();
      console.log('Fetching videos for:', searchTerm);
      
      const data = await fetchFromAPI(`search?query=${searchTerm}&type=video`);
      
      setVideos(prev => {
        if (isInitial) return data.data;
        
        const newVideos = [...prev];
        // Add new videos while avoiding duplicates
        data.data.forEach(video => {
          if (!newVideos.some(v => v.videoId === video.videoId)) {
            newVideos.push(video);
          }
        });
        return newVideos;
      });
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [getNextSearchTerm]);

  // Initial load
  useEffect(() => {
    setVideos([]); // Clear videos when category changes
    fetchVideos(true);
  }, [selectedCategory]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        if (!loadingRef.current) {
          fetchVideos();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchVideos]);

  return (
    <div className="flex min-h-[95vh] bg-white dark:bg-dark transition-colors">
      {/* Sidebar */}
      <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {/* Main Content - Scrollable */}
      <div className="flex-1 lg:ml-[240px] p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-dark-100 dark:text-white transition-colors">
          {selectedCategory} <span className="text-primary">Videos</span>
        </h2>

        <Videos videos={videos} />

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-dark-100/70 dark:text-white/70 mb-4">{error}</p>
            <button
              onClick={() => fetchVideos(true)}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed; 