'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateImageMock, pRemoveImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

// double check that I'm using IMAGE and file path and info is correct.
// this note is due to following along in class...Judy is making a sound

describe('Testing routes at /images', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveImageMock);

  describe('POST to /images', () => {
    test('should return 200 for a successful POST', () => {
      // jest.setTimeout(10000);
      return pCreateImageMock()
        .then((mockResponse) => {
          // const token = mockResponse.accountMock.token
          const { token } = mockResponse.accountMock; // same as above line
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'image of kitty')
            .attach('image', `${__dirname}/assets/kitten.png`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('image of kitty');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });

    test('should return a 400 status if incomplete data is sent', () => {
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('label', 'image of kitty') // label instead of title
            .attach('image', `${__dirname}/assets/kitten.png`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('should return a 401 status if token is invalid', () => {
      return pCreateImageMock()
        .then(() => {
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', 'Bearer')
            .field('title', 'image of dog')
            .attach('image', `${__dirname}/assets/kitten.png`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });

  describe('GET /images/:id', () => {
    test('GET /images/:id should return a 200 status code and the image with the requested id', () => {
      let accountInstance;
      return pCreateImageMock()
        .then((mockAccount) => {
          accountInstance = mockAccount;
          return superagent.get(`${apiUrl}/images/${mockAccount.image._id}`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(accountInstance.image.title);
          expect(response.body.url).toEqual(accountInstance.image.url);
        });
    });

    test('GET /images/:id should return a 404 error status code if sent with a bad id', () => {
      return pCreateImageMock()
        .then((mockAccount) => {
          return superagent.get(`${apiUrl}/images/thisIsAnInvalidId`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });

    test('GET /images/:id should return a 401 error status code if sent with invalid token', () => {
      return pCreateImageMock()
        .then(() => {
          return superagent.get(`${apiUrl}/images/thisIsAnInvalidId`)
            .set('Authorization', 'Bearer');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });

  describe('DELETE /images/:id', () => {
    test('DELETE /images/:id should return a 204 status code if the image is not there', () => {
      return pCreateImageMock()
        .then((mockAccount) => {
          return superagent.delete(`${apiUrl}/images/${mockAccount.image._id}`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE /images/:id should return a 400 error status code if sent with a bad id', () => {
      return superagent.delete(`${apiUrl}/images/thisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('DELETE /images/:id should return a 401 error status code if sent with invalid token', () => {
      return pCreateImageMock()
        .then(() => {
          return superagent.delete(`${apiUrl}/images/thisIsAnInvalidId`)
            .set('Authorization', 'Bearer');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });
});
