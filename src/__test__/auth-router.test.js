'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock, pCreateAccountMock } from './lib/mock-account';

const apiUrl = `http://localhost:${process.env.PORT}/signup`;

describe('Auth Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  describe('POST route /signup', () => {
    test('should return a 200 status code and a TOKEN', () => {
      return superagent.post(apiUrl)
        .send({
          username: 'peffles',
          email: 'wyatt@wyattiscool.com',
          password: 'qwerty123',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test('should return a 400 status code because no name was sent', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('should return 409 status code', () => {
      return pCreateAccountMock()
        .then((mock) => {
          const mockAccount = {
            username: mock.request.username,
            email: mock.request.email,
            password: mock.request.password,
          };
          return superagent.post(apiUrl)
            .send(mockAccount);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });
});
