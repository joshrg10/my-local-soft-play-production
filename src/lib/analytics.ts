import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = () => {
  ReactGA.initialize('G-DW644QXCZX'); // Replace with your actual GA4 measurement ID
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user interactions
export const trackInteraction = (action: string, label?: string) => {
  trackEvent('User Interaction', action, label);
};

// Track search events
export const trackSearch = (searchTerm: string, category?: string) => {
  trackEvent('Search', 'perform_search', searchTerm);
  ReactGA.send({
    hitType: 'event',
    eventCategory: 'Search',
    eventAction: 'perform_search',
    eventLabel: searchTerm,
    searchTerm,
    searchCategory: category,
  });
};

// Track errors
export const trackError = (error: Error, componentStack?: string) => {
  ReactGA.exception({
    description: error.message,
    fatal: true,
  });
};