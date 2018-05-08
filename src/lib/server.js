'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import authRoutes from '../route/auth-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

app.use(loggerMiddleware);

app.use(authRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 status code from the catch/all default route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `SERVER IS LISTENING ON PORT ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `SERVER START ERROR ${JSON.stringify(err)}`);
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'SERVER IS OFF');
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `STOP SERVER ERROR, ${JSON.stringify(err)}`);
    });
};

export { startServer, stopServer };
