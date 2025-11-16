const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { body, validationResult, param } = require('express-validator');
require('dotenv').config();

class SecureGameServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.setupSecurity();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupSecurity() {
    // Helmet for basic security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "ws:", "wss:"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"]
        }
      }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // CORS with strict origin control
    const corsOptions = {
      origin: (origin, callback) => {
        const allowedOrigins = process.env.REACT_APP_CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    this.app.use(cors(corsOptions));
  }

  setupMiddleware() {
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        // Verify JSON payload integrity
        try {
          JSON.parse(buf);
        } catch (e) {
          throw new Error('Invalid JSON payload');
        }
      }
    }));
    
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging for security monitoring
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      console.log(`[${timestamp}] ${req.method} ${req.url} - ${ip}`);
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        version: process.env.REACT_APP_VERSION || '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Secure command endpoint with validation
    this.app.post('/api/command', [
      body('command').isString().isLength({ min: 1, max: 1000 }).trim().escape(),
      body('roomId').optional().isString().isLength({ min: 1, max: 50 }).trim().escape(),
      body('playerId').optional().isString().isLength({ min: 1, max: 50 }).trim().escape()
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'INVALID_INPUT',
          details: errors.array()
        });
      }

      try {
        const result = this.processGameCommand(req.body.command);
        res.json(result);
      } catch (error) {
        console.error('Game command error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'GAME_ERROR',
          message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
        });
      }
    });

    // Secure donation info endpoint
    this.app.get('/api/donations', (req, res) => {
      if (process.env.REACT_APP_ENABLE_DONATIONS !== 'true') {
        return res.status(404).json({ error: 'Donations not enabled' });
      }

      try {
        const donationLinks = JSON.parse(process.env.REACT_APP_DONATION_LINKS || '{}');
        res.json({
          enabled: true,
          links: donationLinks,
          message: 'Support Nebula 3D Dev - Your contributions help keep this project alive!'
        });
      } catch (error) {
        res.status(500).json({ error: 'Invalid donation configuration' });
      }
    });

    // 404 handler for API routes
    this.app.all('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        code: 'NOT_FOUND',
        path: req.path
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      
      // Don't expose internal error details in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? err.message : 'An unexpected error occurred',
        ...(isDevelopment && { stack: err.stack })
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      process.exit(0);
    });
  }

  processGameCommand(command) {
    // This is a mock implementation - replace with actual game logic
    // Input sanitization is already handled by express-validator
    
    const parts = command.split(' ');
    const action = parts[0];

    switch (action) {
      case 'CREATE_ROOM':
        return {
          type: 'ROOM_CREATED',
          roomId: this.generateSecureId(),
          success: true
        };
      
      case 'JOIN_ROOM':
        return {
          type: 'JOIN_RESULT',
          success: true,
          message: 'Joined room successfully'
        };
        
      default:
        return {
          type: 'COMMAND_PROCESSED',
          success: true,
          action: action
        };
    }
  }

  generateSecureId() {
    // Generate cryptographically secure random ID
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('hex');
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🔐 Secure Nebula Game Server running on port ${this.port}`);
      console.log(`🛡️  Security features: ${process.env.REACT_APP_ENABLE_SECURITY_HEADERS === 'true' ? 'ENABLED' : 'DISABLED'}`);
      console.log(`🎮 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💰 Donations: ${process.env.REACT_APP_ENABLE_DONATIONS === 'true' ? 'ENABLED' : 'DISABLED'}`);
    });
  }
}

// Start the secure server
if (require.main === module) {
  const server = new SecureGameServer();
  server.start();
}

module.exports = SecureGameServer;