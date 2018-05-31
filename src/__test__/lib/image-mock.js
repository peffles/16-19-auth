'use strict';

import faker from 'faker';
import { pCreateAccountMock, pRemoveAccountMock } from './mock-account';
import Image from '../../model/image';
import Account from '../../model/account';

const pCreateImageMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Image({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const pRemoveImageMock = () => Promise.all([Account.remove({}), Image.remove({})]);

export { pCreateImageMock, pRemoveImageMock };
