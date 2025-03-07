# PlayFinder UK - Kids Indoor Playground Directory

A comprehensive directory of indoor playgrounds for kids across the UK.

## Performance Testing

This project includes several tools for performance testing and optimization:

### 1. Real-time Performance Monitor

In development mode, a performance monitor is available in the bottom right corner of the application. It shows:

- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)
- TTFB (Time To First Byte)

### 2. Bundle Analysis

To analyze the bundle size and composition:

```bash
npm run analyze
```

This will build the application and open a visualization of the bundle in your browser.

### 3. Lighthouse Testing

To run a Lighthouse audit:

```bash
# First build and preview the production build
npm run build
npm run preview

# In another terminal, run Lighthouse
npm run lighthouse
```

This will generate a Lighthouse report and open it in your browser.

### 4. Puppeteer Performance Test

For more detailed performance testing:

```bash
# First build and preview the production build
npm run build
npm run preview

# In another terminal, run the performance test
node performance-test.js
```

This will generate a `performance-report.json` file with detailed metrics.

## Performance Optimization Techniques Used

1. **Code Splitting**: The application uses dynamic imports to split the code into smaller chunks.
2. **Image Optimization**: Images are properly sized and use modern formats.
3. **Lazy Loading**: Components and images are loaded only when needed.
4. **Compression**: Gzip and Brotli compression for static assets.
5. **Caching**: Proper cache headers for static assets.
6. **Minification**: JavaScript and CSS are minified in production.
7. **Tree Shaking**: Unused code is removed from the bundle.
8. **Responsive Design**: The application is optimized for all device sizes.