import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PerformanceMonitor from './components/PerformanceMonitor';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';
import { initGA, trackPageView } from './lib/analytics';

// Eagerly load HomePage for faster initial render
import HomePage from './pages/HomePage';

// Lazy load non-critical pages
const ListingPage = lazy(() => import('./pages/ListingPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const SoftPlayNearMePage = lazy(() => import('./pages/SoftPlayNearMePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

// Loading fallback component
const PageLoading = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
};

function App() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Initialize Google Analytics
    initGA();
  }, []);

  return (
    <Router>
      <AnalyticsWrapper>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/soft-play/:city/:slug" element={
                <Suspense fallback={<PageLoading />}>
                  <ListingPage />
                </Suspense>
              } />
              <Route path="/soft-play/:city" element={
                <Suspense fallback={<PageLoading />}>
                  <CityPage />
                </Suspense>
              } />
              <Route path="/search" element={
                <Suspense fallback={<PageLoading />}>
                  <SearchResultsPage />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<PageLoading />}>
                  <AboutPage />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<PageLoading />}>
                  <ContactPage />
                </Suspense>
              } />
              <Route path="/privacy-policy" element={
                <Suspense fallback={<PageLoading />}>
                  <PrivacyPolicyPage />
                </Suspense>
              } />
              <Route path="/soft-play-near-me" element={
                <Suspense fallback={<PageLoading />}>
                  <SoftPlayNearMePage />
                </Suspense>
              } />
              <Route path="/best-soft-play-areas-uk" element={
                <Suspense fallback={<PageLoading />}>
                  <SearchResultsPage />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<PageLoading />}>
                  <NotFoundPage />
                </Suspense>
              } />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
          {import.meta.env.DEV && <PerformanceMonitor />}
        </div>
      </AnalyticsWrapper>
    </Router>
  );
}

export default App;