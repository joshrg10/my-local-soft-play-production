import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Optimize JSX
      jsxRuntime: 'automatic',
      // Babel options
      babel: {
        plugins: [
          // Remove prop types in production
          mode === 'production' && ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
        ].filter(Boolean),
      },
    }),
  ];
  
  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }
  
  // Add compression plugin for production builds
  if (mode === 'production' || mode === 'analyze') {
    plugins.push(
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        filter: /\.(js|css|html|svg)$/i,
        deleteOriginFile: false,
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        filter: /\.(js|css|html|svg)$/i,
        deleteOriginFile: false,
      })
    );
  }
  
  return {
    plugins,
    optimizeDeps: {
      exclude: ['lucide-react'],
      // Force include dependencies that might be missed
      include: ['react', 'react-dom', 'react-router-dom'],
      // Optimize dependencies during build
      esbuildOptions: {
        target: 'es2020',
        // Optimize bundle size
        minify: true,
        // Tree shaking
        treeShaking: true,
      },
    },
    build: {
      // Enable source maps for better debugging (only in dev/analyze)
      sourcemap: mode !== 'production',
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            leaflet: ['leaflet', 'react-leaflet'],
            icons: ['lucide-react'],
          },
          // Optimize chunk size
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Optimize external dependencies
        external: [],
      },
      // Optimize CSS
      cssCodeSplit: true,
      // Minify output
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log'] : [],
        },
        format: {
          comments: false,
        },
      },
      // Optimize build
      target: 'es2020',
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,
      // Optimize assets
      assetsInlineLimit: 4096, // 4kb
    },
    server: {
      // Enable compression in development
      compress: true,
      // Optimize HMR
      hmr: {
        overlay: true,
      },
    },
    // Optimize asset handling
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.webp'],
    // Preload critical chunks
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js' && filename.endsWith('.css')) {
          return { relative: true, preload: true };
        }
        return { relative: true };
      },
    },
    // Optimize preview server
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
    },
  };
});