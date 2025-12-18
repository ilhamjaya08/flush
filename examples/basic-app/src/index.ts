import { FlushApp, Middleware } from 'flush-core';
import { UserController } from '@/controllers/UserController';

const app = new FlushApp({
  port: 3000,
  host: 'localhost'
});


app.use(Middleware.logger());
app.use(Middleware.cors());
app.use(Middleware.json());


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Flush Framework! 🚀',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});


app.group('/api', (router) => {
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });
  

  router.get('/users', UserController.index);
  router.get('/users/:id', UserController.show);
  router.post('/users', UserController.store);
  router.put('/users/:id', UserController.update);
  router.delete('/users/:id', UserController.destroy);
});


console.log('🚀 Starting Flush application...');
app.listen().catch(console.error);