import { Link } from 'react-router-dom';
import { logo } from '../utils/constants';
import SearchBar from './SearchBar';
import { Menu } from '../assets/icons';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-100/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5 transition-colors">
      <div className="flex items-center gap-4 px-4 h-14">
        {/* Left Section - Hidden when search is shown on mobile */}
        <div className={`flex items-center gap-4 min-w-fit ${showSearch ? 'hidden md:flex' : 'flex'}`}>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-dark-100 dark:text-white" />
          </button>
          <Link to="/" className="flex items-center gap-1 hover:opacity-90 transition-opacity">
            <img src={logo} alt="logo" className="h-5" />
            <h1 className="text-xl font-medium text-dark-100 dark:text-white hidden sm:block">
              TitanTube
            </h1>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className={`${showSearch ? 'flex flex-1' : 'hidden md:flex flex-1'} justify-center max-w-[720px]`}>
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search"
          >
            {showSearch ? (
              <svg className="w-6 h-6 text-dark-100 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-dark-100 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>

          {/* Theme Toggle - Hidden when search is shown on mobile */}
          <button
            onClick={toggleTheme}
            className={`p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ${showSearch ? 'hidden md:block' : ''}`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-6 h-6 text-dark-100 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-dark-100 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Actions - Hidden when search is shown on mobile */}
          <div className={`flex items-center gap-2 ${showSearch ? 'hidden md:flex' : ''}`}>
            <button 
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-primary border border-primary/20 rounded-full hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span className="text-sm font-medium">Create</span>
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm"
            >
              K
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 