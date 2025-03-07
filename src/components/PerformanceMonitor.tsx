import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
  fid: number | null;
  ttfb: number | null;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  });
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    // Only run in development mode
    if (import.meta.env.DEV) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0].startTime;
          setMetrics((prev) => ({ ...prev, fcp }));
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.startTime;
          setMetrics((prev) => ({ ...prev, lcp }));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            setMetrics((prev) => ({ ...prev, cls: clsValue }));
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fid = entries[0].processingStart - entries[0].startTime;
          setMetrics((prev) => ({ ...prev, fid }));
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Time to First Byte
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const ttfb = (navigationEntries[0] as PerformanceNavigationTiming).responseStart;
        setMetrics((prev) => ({ ...prev, ttfb }));
      }

      // Cleanup
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  const getMetricColor = (name: string, value: number | null): string => {
    if (value === null) return 'text-gray-400';
    
    switch (name) {
      case 'FCP':
        return value < 1800 ? 'text-green-500' : value < 3000 ? 'text-yellow-500' : 'text-red-500';
      case 'LCP':
        return value < 2500 ? 'text-green-500' : value < 4000 ? 'text-yellow-500' : 'text-red-500';
      case 'CLS':
        return value < 0.1 ? 'text-green-500' : value < 0.25 ? 'text-yellow-500' : 'text-red-500';
      case 'FID':
        return value < 100 ? 'text-green-500' : value < 300 ? 'text-yellow-500' : 'text-red-500';
      case 'TTFB':
        return value < 200 ? 'text-green-500' : value < 500 ? 'text-yellow-500' : 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showMetrics ? (
        <div className="bg-white rounded-lg shadow-lg p-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Performance Metrics</h3>
            <button 
              onClick={() => setShowMetrics(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>FCP:</span>
              <span className={getMetricColor('FCP', metrics.fcp)}>
                {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Measuring...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={getMetricColor('LCP', metrics.lcp)}>
                {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Measuring...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={getMetricColor('CLS', metrics.cls)}>
                {metrics.cls !== null ? metrics.cls.toFixed(3) : 'Measuring...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={getMetricColor('FID', metrics.fid)}>
                {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Waiting for input...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>TTFB:</span>
              <span className={getMetricColor('TTFB', metrics.ttfb)}>
                {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Measuring...'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowMetrics(true)}
          className="bg-pink-500 text-white rounded-full p-2 shadow-lg hover:bg-pink-600 transition-colors"
          title="Show Performance Metrics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default PerformanceMonitor;