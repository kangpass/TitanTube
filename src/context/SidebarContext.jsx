import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}; 