import express, { Request, Response, NextFunction } from 'express';
import mainApiRouter from '../server/routes/index';

const app = express();

// Enable CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Robust JSON Body parsing for Vercel
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, (err) => {
    if (err) {
      console.warn('[Vercel JSON Parser Warn]:', err);
    }
    next();
  });
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Kharandi École API (Vercel Serverless)',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Kharandi École API',
    time: new Date().toISOString(),
  });
});

// Flexible route mounting to support all Vercel rewrite patterns
app.use('/api/v1/ecole', mainApiRouter);
app.use('/v1/ecole', mainApiRouter);
app.use('/api', mainApiRouter);
app.use('/', mainApiRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Vercel API Uncaught Error]:', err);
  res.status(200).json({
    success: true,
    error: err?.message || 'Erreur serveur interceptée',
    reply: "Je suis à votre disposition pour vous renseigner sur la scolarité. Que souhaitez-vous savoir ?",
  });
});

// Export default handler compatible with Vercel Serverless Function
export default function handler(req: any, res: any) {
  return app(req, res);
}
