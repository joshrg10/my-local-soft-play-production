import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function runPerformanceTest() {
  console.log('Starting performance test...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable performance metrics collection
    await page.setCacheEnabled(false);
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();
    
    // Navigate to the page and wait for network idle
    console.log('Loading page...');
    const navigationStart = Date.now();
    await page.goto('http://localhost:4173/', {
      waitUntil: 'networkidle0',
    });
    const navigationEnd = Date.now();
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return {
        // Navigation Timing API
        navigationTiming: performance.getEntriesByType('navigation')[0],
        // Resource Timing API
        resources: performance.getEntriesByType('resource'),
        // Paint Timing API
        paintMetrics: performance.getEntriesByType('paint'),
        // Memory info if available
        memory: (performance as any).memory ? (performance as any).memory : null,
      };
    });
    
    // Get JS and CSS coverage
    const jsCoverage = await page.coverage.stopJSCoverage();
    const cssCoverage = await page.coverage.stopCSSCoverage();
    
    // Calculate unused bytes
    let totalBytes = 0;
    let usedBytes = 0;
    
    [...jsCoverage, ...cssCoverage].forEach(entry => {
      totalBytes += entry.text.length;
      for (const range of entry.ranges) {
        usedBytes += range.end - range.start;
      }
    });
    
    // Take a screenshot
    await page.screenshot({ path: 'performance-test-screenshot.png' });
    
    // Prepare the report
    const report = {
      timestamp: new Date().toISOString(),
      navigationTime: navigationEnd - navigationStart,
      performanceMetrics,
      coverage: {
        totalBytes,
        usedBytes,
        unusedBytes: totalBytes - usedBytes,
        percentageUnused: ((totalBytes - usedBytes) / totalBytes * 100).toFixed(2)
      }
    };
    
    // Save the report
    await fs.writeFile('performance-report.json', JSON.stringify(report, null, 2));
    
    console.log('Performance test completed!');
    console.log(`Navigation time: ${navigationEnd - navigationStart}ms`);
    console.log(`Unused code: ${report.coverage.percentageUnused}%`);
    
  } catch (error) {
    console.error('Error during performance test:', error);
  } finally {
    await browser.close();
  }
}

runPerformanceTest().catch(console.error);