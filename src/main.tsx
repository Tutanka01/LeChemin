import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import Layout from './shared/Layout.tsx';
import Home from './pages/Home';
import Parcours from './pages/Parcours';
import ParcoursIndex from './pages/ParcoursIndex';
import ParcoursPersonnalise from './pages/ParcoursPersonnalise';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/auth/Auth';
import AuthCallback from './pages/auth/Callback';
import MesParcours from './pages/MesParcours';
import MesParcoursDetail from './pages/MesParcoursDetail.tsx';

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
              <Route path="/parcours" element={<ParcoursIndex />} />
              <Route path="/parcours/devops" element={<Parcours />} />
              <Route path="/parcours/personnalise" element={<ParcoursPersonnalise />} />
              <Route path="/mes-parcours" element={<MesParcours />} />
              <Route path="/mes-parcours/:id" element={<MesParcoursDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
