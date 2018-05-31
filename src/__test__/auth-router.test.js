'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock, pCreateAccountMock } from './lib/mock-account';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Auth Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  describe('POST route /signup', () => {
    test('should return a 200 status code and a TOKEN', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({
          username: 'peffles',
          email: 'wyatt@wyattiscooler.com',
          password: 'qwerty123',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test('should return a 400 status code when no name is sent', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({})
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('should return 409 status code due to dupe name', () => { // eslint-disable-line
      return pCreateAccountMock()
        .then((mock) => {
          const mockAccount = {
            username: mock.request.username,
            email: mock.request.email,
            password: mock.request.password,
          };
          return superagent.post(`${apiUrl}/signup`)
            .send(mockAccount);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('GET /login', () => {
    test('GET login should return a 200 status code and TOKEN', () => {
      return pCreateAccountMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });
});
