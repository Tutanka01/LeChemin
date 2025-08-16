import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import Layout from './shared/Layout.tsx';
import Home from './pages/Home';
import Parcours from './pages/Parcours';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/auth/Auth';
import AuthCallback from './pages/auth/Callback';

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/parcours" element={<Parcours />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
