import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GardenProvider } from '@/context/GardenContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PageTransition } from '@/components/ui/PageTransition';
import { WallpaperLayer } from '@/components/ui/WallpaperLayer';
import { HomePage } from '@/pages/HomePage/HomePage';
import { RecordPage } from '@/pages/RecordPage/RecordPage';
import { TimelinePage } from '@/pages/TimelinePage/TimelinePage';
import { MeditatePage } from '@/pages/MeditatePage/MeditatePage';
import { MoodJourneyPage } from '@/pages/MoodJourneyPage/MoodJourneyPage';
import { MoodAlbumPage } from '@/pages/MoodAlbumPage/MoodAlbumPage';
import { MonthlyReviewPage } from '@/pages/MonthlyReviewPage/MonthlyReviewPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/record" element={<PageTransition><RecordPage /></PageTransition>} />
        <Route path="/garden" element={<Navigate to="/record" replace />} />
        <Route path="/meditate" element={<PageTransition><MeditatePage /></PageTransition>} />
        <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
        <Route path="/journey" element={<PageTransition><MoodJourneyPage /></PageTransition>} />
        <Route path="/album" element={<PageTransition><MoodAlbumPage /></PageTransition>} />
        <Route path="/review" element={<PageTransition><MonthlyReviewPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <GardenProvider>
      <ToastProvider>
        <BrowserRouter>
          <WallpaperLayer />
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </GardenProvider>
  );
}
