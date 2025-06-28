import express from 'express';
import dotenv from 'dotenv';
import fetch from './steps/fetch.js';
import extract from './steps/extract.js';
import generateSnippet from './steps/generate_snippet.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security and middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS for production
  if (NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Simple rate limiting (in production, use Redis-based solution)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_REQUESTS = process.env.RATE_LIMIT || 30; // requests per minute

const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const userData = rateLimitMap.get(clientIP);
  
  if (now > userData.resetTime) {
    userData.count = 1;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    userData.count++;
  }
  
  if (userData.count > RATE_LIMIT_REQUESTS) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. Limit: ${RATE_LIMIT_REQUESTS} requests per minute.`,
      retryAfter: Math.ceil((userData.resetTime - now) / 1000)
    });
  }
  
  next();
};

// Apply rate limiting
app.use(rateLimit);

// Logging middleware
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };
    
    if (NODE_ENV === 'production') {
      console.log(JSON.stringify(log));
    } else {
      console.log(`${log.timestamp} ${log.method} ${log.url} ${log.status} ${log.duration}`);
    }
  });
  
  next();
};

app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// Input validation
const validateWorkflowInput = (req, res, next) => {
  const { url, context: _context } = req.query;
  
  if (!url) {
    return res.status(400).json({
      error: 'Missing required parameter',
      message: 'URL parameter is required',
      usage: 'GET /?url=https://example.com&context=after_ad'
    });
  }
  
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid URL',
      message: 'Please provide a valid URL',
      example: 'https://example.com/article'
    });
  }
  
  // Validate URL protocol
  const parsedUrl = new URL(url);
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      error: 'Invalid URL protocol',
      message: 'Only HTTP and HTTPS URLs are allowed'
    });
  }
  
  next();
};

// Main workflow endpoint
app.get('/', validateWorkflowInput, async (req, res) => {
  const { url, context = '' } = req.query;
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`🚀 [${requestId}] Starting AutoInjector workflow for: ${url}`);
  
  try {
    // Step 1: Fetch
    console.log(`📥 [${requestId}] Fetching HTML content...`);
    const fetchResult = await fetch({ 
      trigger: { 
        event: { 
          query: { url, context } 
        } 
      } 
    });
    
    if (!fetchResult || !fetchResult.html) {
      throw new Error('Failed to fetch HTML content');
    }
    
    console.log(`📥 [${requestId}] HTML fetched successfully (${fetchResult.html.length} chars)`);
    
    // Step 2: Extract
    console.log(`🔍 [${requestId}] Extracting injection candidates...`);
    const extractResult = await extract({
      trigger: {
        event: {
          query: { url, context }
        }
      },
      fetch: fetchResult
    });
    
    if (!extractResult || !extractResult.candidates || extractResult.candidates.length === 0) {
      throw new Error('No valid injection candidates found');
    }
    
    console.log(`🔍 [${requestId}] Found ${extractResult.candidates.length} candidates`);
    
    // Step 3: Generate snippet
    console.log(`🎯 [${requestId}] Generating injection snippet...`);
    const snippetResult = await generateSnippet({
      trigger: {
        event: {
          query: { url, context }
        }
      },
      fetch: fetchResult,
      extract: extractResult
    });
    
    if (!snippetResult || !snippetResult.snippet) {
      throw new Error('Failed to generate injection snippet');
    }
    
    console.log(`✅ [${requestId}] Workflow completed successfully`);
    
    // Return results
    res.status(200).json({
      success: true,
      requestId,
      data: {
        snippet: snippetResult.snippet,
        candidatesUsed: extractResult.candidates.length,
        model: snippetResult.model || 'hardcoded-green-block',
        targetUrl: url,
        context: context,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Workflow failed:`, error.message);
    
    res.status(500).json({
      success: false,
      requestId,
      error: 'Workflow execution failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'Use GET / with url parameter to run AutoInjector workflow',
    usage: 'GET /?url=https://example.com&context=after_ad',
    availableEndpoints: {
      '/': 'Main workflow endpoint',
      '/health': 'Health check endpoint'
    }
  });
});

// Global error handler
app.use((error, req, res, _next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 AutoInjector server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 Ready to process injection requests!`);
}); 