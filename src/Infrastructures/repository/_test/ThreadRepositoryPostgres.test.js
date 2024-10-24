const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const FormThread = require('../../../Domains/threads/entities/FormThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should error when owner doesn\'t exist', async () => {
      // Arrange
      const formThread = new FormThread({
        title: 'judul',
        body: 'body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.addThread(formThread)).rejects.toThrowError();
    });

    it('should add thread to database and persist thread', async () => {
      // Arrange
      const formThread = new FormThread({
        title: 'judul',
        body: 'body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      const newThread = await threadRepositoryPostgres.addThread(formThread);
      expect(newThread).toBeInstanceOf(NewThread);
      expect(newThread.id).toBe('thread-123');
      expect(newThread.title).toBe('judul');
      expect(newThread.owner).toBe('user-123');

      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0]).toHaveProperty('id', 'thread-123');
      expect(threads[0]).toHaveProperty('title', 'judul');
      expect(threads[0]).toHaveProperty('body', 'body');
      expect(threads[0]).toHaveProperty('owner', 'user-123');
    });
  });

  describe('verifyThread function', () => {
    it('should throw not found error when thread doesn\'t exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw not found error', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should return notfound error when thread doesn\'t exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return Thread entity', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ title: 'thread test', body: 'body test' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', content: 'comment1' });
      await CommentTableTestHelper.addComment({ id: 'comment-124', content: 'comment2' });
      await ReplyTableTestHelper.addReply({ content: 'reply 1' });

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread('thread-123')).resolves.not.toThrowError(NotFoundError);

      const thread = await threadRepositoryPostgres.getThread('thread-123');
      expect(thread).toBeInstanceOf(Thread);
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('thread test');
      expect(thread.body).toBe('body test');
      expect(thread.username).toBe('dicoding');
      expect(thread.date).toEqual(new Date('2014-01-01 10:11:56'));
      expect(Array.isArray(thread.comments)).toBe(true);
      expect(thread.comments.length).toBe(0);
    });
  });
});
