import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from '../assets/icons';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex w-full max-w-[720px]"
    >
      <div className={`
        flex flex-1 items-center bg-black/5 dark:bg-dark-200 border transition-all duration-200
        ${isFocused 
          ? 'border-primary shadow-[0_0_0_1px] shadow-primary' 
          : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
        }
        rounded-l-full overflow-hidden
      `}>
        {isFocused && (
          <div className="pl-4">
            <Search className="w-5 h-5 text-black/50 dark:text-white/50" />
          </div>
        )}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent text-dark-100 dark:text-white placeholder-black/50 dark:placeholder-white/50 px-4 py-2 text-sm outline-none min-w-0 h-10"
        />
      </div>
      <button 
        type="submit" 
        className="px-6 bg-black/5 dark:bg-dark-200/50 hover:bg-black/10 dark:hover:bg-dark-200 border-y border-r border-black/10 dark:border-white/10 rounded-r-full transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-dark-100 dark:text-white" />
      </button>
    </form>
  );
};

export default SearchBar; 