import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GardenProvider } from '@/context/GardenContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PageTransition } from '@/components/ui/PageTransition';
import { ParticleCursor } from '@/components/ui/ParticleCursor';
import { HomePage } from '@/pages/HomePage/HomePage';
import { RecordPage } from '@/pages/RecordPage/RecordPage';
import { GardenPage } from '@/pages/GardenPage/GardenPage';
import { TimelinePage } from '@/pages/TimelinePage/TimelinePage';
import { MeditatePage } from '@/pages/MeditatePage/MeditatePage';

/** 路由 + 转场动画（按 pathname 切换，fade-up 无硬切） */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/record" element={<PageTransition><RecordPage /></PageTransition>} />
        <Route path="/garden" element={<PageTransition><GardenPage /></PageTransition>} />
        <Route path="/meditate" element={<PageTransition><MeditatePage /></PageTransition>} />
        <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/** 路由 + 全局 Provider 挂载（架构设计第二节路由表） */
export function App() {
  return (
    <GardenProvider>
      <ToastProvider>
        <BrowserRouter>
          <ParticleCursor />
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </GardenProvider>
  );
}
