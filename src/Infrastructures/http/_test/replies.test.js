const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  describe('when POST /threads/:id/comments/:commentId/replies', () => {
    it('should response 401 when token not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when submit with non-existents thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await UsersTableTestHelper.addUser({ username: 'dudung' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'dudung' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when submit with non-existents comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'dudung' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-321/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 201 and persisted comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();

      const comment = await ReplyTableTestHelper
        .findRepliesById(responseJson.data.addedReply.id);
      expect(comment[0].id).toEqual(responseJson.data.addedReply.id);
    });
  });

  describe('when DELETE /threads/:id/comments/:commentId/replies/:replyId', () => {
    it('should response 200 when succes deleting reply and change reply isdeleted status to true', async () => {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const comments = await ReplyTableTestHelper.findRepliesById('reply-123');
      expect(comments[0].isdeleted).toBe(true);
    });

    it('should response 401 when token doesn\'t valid', async () => {
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when deleting reply as not-owner', async () => {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-333', username: 'dudung' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('bukan pemilik reply');
    });

    it('should response 404 when deleting non-existense thread', async () => {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-333/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when deleting non-existense comment', async () => {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-333/replies/reply-123',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 404 when deleting non-existense reply', async () => {
      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-333',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak ditemukan');
    });
  });
});
