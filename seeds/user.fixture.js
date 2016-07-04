'use strict';

const fs = require('fs');
const path = require('path');
const passwordHelper = require('../app/helpers/password');
const User = require('../app/models/user');

main();

function main() {
  generateUser((err, user) => {
    if (err) {
      throw err;
    }

    const output = fileOutput(user);

    fs.writeFile(path.join(__dirname, '../tests/fixtures/user.js'), output, (err) => {
      if (err) {
        throw err;
      }

      console.log('Done creating user fixture');
    });
  });
}

function generateUser(callback) {
  passwordHelper.hash('user_password', (err, password, salt) => {
    if (err) {
      return callback(err);
    }

    const user = new User({
      name: 'Test User',
      email: 'test@crm.com',
      phoneNumber: '0700000007',
      password: password,
      passwordSalt: salt,
      active: true
    });

    callback(null, user);
  })
}

function fileOutput(data) {
  return `'user strict';

module.exports = {
  _id: '${data._id}',
  email: '${data.email}',
  password: '${data.password}',
  passwordSalt: '${data.passwordSalt}',
  active: '${data.active}',
  createdAt: '${data.createdAt}'
};
`;

}
