import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import mainApiRouter from './server/routes/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging in dev
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    }
    next();
  });

  // CORS headers for local/cross-origin calls
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // Health and root check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Kharandi École Backend Service',
      version: '1.0.0',
      time: new Date().toISOString(),
    });
  });

  // Mount API Endpoints at /api/v1/ecole/
  app.use('/api/v1/ecole', mainApiRouter);

  // Vite middleware for development vs Static fallback for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`🚀 KHARANDI ÉCOLE BACKEND ONLINE`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
    console.log(`🔌 BASE API: http://0.0.0.0:${PORT}/api/v1/ecole/`);
    console.log(`========================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
