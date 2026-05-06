import { EventEmitter } from 'events';
import httpMocks from 'node-mocks-http';

export const requestApp = (app, options) => {
  const req = httpMocks.createRequest({
    method: options.method,
    url: options.url,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body
  });

  const res = httpMocks.createResponse({
    eventEmitter: EventEmitter
  });

  return new Promise((resolve, reject) => {
    res.on('end', () => {
      const rawBody = res._getData();
      let body = rawBody;

      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        body = rawBody;
      }

      resolve({
        statusCode: res.statusCode,
        body
      });
    });

    app.handle(req, res, reject);
  });
};
