import { useEffect } from 'react';

const usePageLoadLatency = () => {
  useEffect(() => {
    const calculateLatency = () => {
      window.addEventListener('load', () => {
        const timing = performance.timing;

        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        const responseTime = timing.responseEnd - timing.requestStart;

        console.log('Full Page Load Time:', pageLoadTime, 'ms');
        console.log('DOM Content Loaded Time:', domContentLoadedTime, 'ms');
        console.log('Server Response Time:', responseTime, 'ms');

        // Optional: Send data to a backend
      });
    };

    calculateLatency();

    return () => {
      window.removeEventListener('load', calculateLatency);
    };
  }, []);
};

export default usePageLoadLatency;
