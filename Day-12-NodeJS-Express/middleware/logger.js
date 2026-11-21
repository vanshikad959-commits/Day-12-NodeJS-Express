/**
 * Custom request logger middleware.
 * Logs the HTTP method, URL, timestamp, and (once the response finishes)
 * the status code and time taken.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};

module.exports = logger;
