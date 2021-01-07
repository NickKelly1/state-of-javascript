/**
 * Module dependencies.
 */

import http from 'http';
import express from 'express';
import { bootHttp } from '../boot.http';
import { $TS_FIX_ME } from '../common/types/$ts-fix-me.type';
import { EnvService, EnvServiceSingleton } from '../common/environment/env';
import { logger } from '../common/logger/logger';
import { prettyQ } from '../common/helpers/pretty.helper';
import { OrUndefined } from '../common/types/or-undefined.type';
import { bootServices } from '../boot.services';
import SocketIO from 'socket.io';
import { bootWs } from '../boot.ws';
import mkdirp from 'mkdirp';

let _server: OrUndefined<http.Server>;

async function bootServer(arg: { env: EnvService }) {
  const { env } = arg;
  // ensure directories exist...
  await mkdirp(env.LOG_DIR);
  await mkdirp(env.UPLOADS_DIR);
  const universal = await bootServices({ env });
  const { app, io, } = universal;
  await bootHttp({ universal });
  await bootWs({ universal });

  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(env.PORT);
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);
  _server = server;
  io.attach(server);

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
    const port = parseInt(val, 10);

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

    const bind = typeof port === 'string'
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
    const addr: $TS_FIX_ME<any> = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.debug('Listening on ' + bind);
  }
}

bootServer({ env: EnvServiceSingleton })
  .catch(error => {
    // failed to boot properly...
    logger.error(`Errored while booting: ${prettyQ(error)}`);
    logger.info('Closing server...');
    // close server
    if (_server) { _server.close(() => logger.info('Server closed')); }
    // exit program
    process.exit(1);
  })
  // double errored... just quit
  .catch(() => { process.exit(1); });
