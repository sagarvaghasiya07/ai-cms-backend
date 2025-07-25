const userController = require('./user.controller');
const contentController = require('./content.controller');

module.exports = {
    ...userController,
    ...contentController
}
