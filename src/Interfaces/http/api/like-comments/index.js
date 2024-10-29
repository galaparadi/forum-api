const routes = require('./routes');
const LikeCommentsHandler = require('./handler');

module.exports = {
  name: 'like-comments',
  register: async (server, { container }) => {
    const likeCommentsHandler = new LikeCommentsHandler(container);
    server.route(routes(likeCommentsHandler));
  },
};
