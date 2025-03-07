import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove the loading spinner once the app is loaded
const removeLoadingSpinner = () => {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.classList.add('opacity-0');
    setTimeout(() => {
      spinner.remove();
    }, 300);
  }
};

// Report web vitals if in development mode
if (import.meta.env.DEV) {
  // Import web-vitals dynamically to measure performance
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const reportWebVitals = (onPerfEntry: any) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    };
    
    // Log metrics to console
    reportWebVitals((metric: any) => {
      console.log(metric);
    });
  }).catch(err => {
    console.warn('Web Vitals could not be loaded:', err);
  });
}

// Use createRoot for concurrent mode
const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Hydrate the app (React will preserve the server-rendered HTML)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove loading spinner after render
removeLoadingSpinner();

// Preload critical images
const preloadImages = () => {
  const imagesToPreload = [
    'https://images.unsplash.com/photo-1566454825481-9c31bd88c36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1543872084-c7bd3822856f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  ];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Execute preloading after initial render
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(preloadImages);
} else {
  setTimeout(preloadImages, 1000);
}

// Prefetch other routes after the page is loaded
const prefetchRoutes = () => {
  const routes = [
    '/search',
    '/about',
    '/contact'
  ];
  
  routes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

// Execute route prefetching after the page is interactive
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(prefetchRoutes, { timeout: 2000 });
} else {
  setTimeout(prefetchRoutes, 2000);
}