import { Link } from 'react-router-dom';
import { categories } from '../utils/constants';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const { isOpen } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-[56px] h-[calc(100vh-56px)] w-[240px] bg-white dark:bg-dark transition-colors overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4">
          <SidebarContent 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`
          lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            useSidebar().toggleSidebar();
          }
        }}
      >
        <div 
          className={`
            w-[240px] h-full bg-white dark:bg-dark transition-transform duration-300
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 pt-[70px]">
            <SidebarContent 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelect={() => useSidebar().toggleSidebar()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({ selectedCategory, setSelectedCategory, onSelect }) => (
  <>
    {categories.map((category) => (
      <button
        key={category.name}
        onClick={() => {
          setSelectedCategory(category.name);
          onSelect?.();
        }}
        className={`
          sidebar-button
          ${selectedCategory === category.name ? 'active' : ''}
        `}
      >
        <span className="text-xl">
          {category.icon}
        </span>
        <span className="text-sm font-medium">
          {category.name}
        </span>
      </button>
    ))}

    <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
      <div className="text-xs text-dark-100/50 dark:text-white/50 px-4 mb-2">
        About
      </div>
      <div className="text-xs text-dark-100/50 dark:text-white/50 px-4 mb-2 font-bold">
        Made by Karanvir Kang
      </div>
      {/* <Link 
        to="https://github.com/yourusername" 
        target="_blank"
        className="sidebar-button"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </Link> */}
    </div>
  </>
);

export default Sidebar; 