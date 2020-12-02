/**
 * Module dependencies.
 */

import http from 'http';
import { bootApp } from '../app';
import { ExpressContext } from '../common/classes/express-context';
import { $TS_FIX_ME } from '../common/types/$ts-fix-me.type';
import { EnvService, EnvServiceSingleton } from '../common/environment/env';
import { logger } from '../common/logger/logger';

async function bootServer(arg: { env: EnvService }) {
  const { env } = arg;
  const app: ExpressContext = await bootApp({ env });

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(env.PORT);
  app.root.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app.root);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val: $TS_FIX_ME<any>) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error: $TS_FIX_ME<any>) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr: $TS_FIX_ME<any> = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.debug('Listening on ' + bind);
  }
}

bootServer({ env: EnvServiceSingleton });