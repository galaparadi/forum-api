const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  describe('when GET /threads', () => {
    it('should response 404 when thread doesn\'t exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-234' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-234' });
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-321',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-234' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123', commentid: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-234', commentid: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-345', commentid: 'comment-234' });
      await ReplyTableTestHelper.addReply({ id: 'reply-456', commentid: 'comment-234' });
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const { thread } = responseJson.data;
      expect(Array.isArray(thread.comments)).toBe(true);
      expect(thread.comments.length).toBe(2);
      expect(Array.isArray(thread.comments[0].replies)).toBe(true);
      expect(thread.comments[0].replies.length).toBe(2);
    });
  });

  describe('when POST /threads', () => {
    it('should response 401 when token not exist', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: 'body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: 'body',
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();

      const thread = await ThreadTableTestHelper.findThreadsById(responseJson.data.addedThread.id);
      expect(thread[0].id).toEqual(responseJson.data.addedThread.id);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'body',
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread. properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: 123456,
      };

      const tokenManager = container.getInstance(AuthenticationTokenManager.name);
      await UsersTableTestHelper.addUser({ username: 'mamat' });
      const token = await tokenManager.createAccessToken({ id: 'user-123', username: 'mamat' });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread. tipe data tidak sesuai');
    });
  });
});
