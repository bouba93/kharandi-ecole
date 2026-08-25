import express, { Request, Response, NextFunction } from 'express';
import mainApiRouter from '../server/routes/index';

const app = express();

// JSON Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    console.log(`[Vercel API] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// CORS headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Kharandi École Vercel Serverless Function',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Mount on /api/v1/ecole and /v1/ecole
app.use('/api/v1/ecole', mainApiRouter);
app.use('/v1/ecole', mainApiRouter);

// Export for Vercel Serverless Function
export default app;
