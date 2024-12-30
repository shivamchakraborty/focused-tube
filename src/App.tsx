import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { CreatorPage } from './pages/CreatorPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen transition-colors dark:bg-dark">
              <div className="flex-grow">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/"
                    element={
                      <AuthGuard>
                        <Dashboard />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/creator/:channelId"
                    element={
                      <AuthGuard>
                        <CreatorPage />
                      </AuthGuard>
                    }
                  />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;