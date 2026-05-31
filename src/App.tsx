import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GardenProvider } from '@/context/GardenContext';
import { ToastProvider } from '@/components/ui/Toast';
import { HomePage } from '@/pages/HomePage/HomePage';
import { RecordPage } from '@/pages/RecordPage/RecordPage';
import { GardenPage } from '@/pages/GardenPage/GardenPage';
import { TimelinePage } from '@/pages/TimelinePage/TimelinePage';

/** 路由 + 全局 Provider 挂载（架构设计第二节路由表） */
export function App() {
  return (
    <GardenProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </GardenProvider>
  );
}
