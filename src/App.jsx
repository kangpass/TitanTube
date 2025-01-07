import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Feed, VideoDetail, ChannelDetail, SearchFeed } from './components';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-white dark:bg-dark transition-colors">
          <Navbar />
          <div className="">
            <Routes>
              <Route path="/" exact element={<Feed />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/channel/:id" element={<ChannelDetail />} />
              <Route path="/search/:searchTerm" element={<SearchFeed />} />
            </Routes>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
