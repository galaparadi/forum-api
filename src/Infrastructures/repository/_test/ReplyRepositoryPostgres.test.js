const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const FormReply = require('../../../Domains/reply/entities/FormReply');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DeleteReply = require('../../../Domains/reply/entities/DeleteReply');
const Reply = require('../../../Domains/reply/entities/Reply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/reply/entities/NewReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply', () => {
    it('should throw error when comment doesn\'t exist', async () => {
      // Arrange
      const formThread = new FormReply({
        commentId: 'comment-123',
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-321' });

      // Action & Assert
      expect(replyRepositoryPostgres.addReply(formThread)).rejects.toThrowError();
    });

    it('should throw error when owner doesn\'t exist', async () => {
      // Arrange
      const formReply = new FormReply({
        content: 'content',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-321',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      expect(replyRepositoryPostgres.addReply(formReply)).rejects.toThrowError();
    });

    it('should success and persist reply', async () => {
      // Arrange
      const formReply = new FormReply({
        content: 'content',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action
      const newReply = await replyRepositoryPostgres.addReply(formReply);

      // Assert
      expect(newReply).toBeInstanceOf(NewReply);
      expect(newReply.content).toBe('content');
      expect(newReply.owner).toBe('user-123');

      const replies = await ReplyTableTestHelper.findRepliesById(newReply.id);
      expect(replies.length).toBeGreaterThan(0);
      expect(replies[0].id).toBe(newReply.id);
    });
  });

  describe('getRepliesFromComment', () => {
    it("should throw notfound error when comment doesn't exist", async () => {
      // Arange
      const commentId = 'comment-321';
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      expect(replyRepositoryPostgres.getRepliesFromComment(commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should get replies from comment', async () => {
      // Arange
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      await ReplyTableTestHelper.addReply({ id: 'reply-123', content: 'reply 1' });

      // Action & Assert
      const replies = await replyRepositoryPostgres.getRepliesFromComment(commentId);
      expect(replies).not.toBeInstanceOf(InvariantError);
      expect(Array.isArray(replies)).toBe(true);
      expect(replies.length).toBeGreaterThan(0);

      expect(replies[0]).toBeInstanceOf(Reply);
      expect(replies[0].id).toBe('reply-123');
      expect(replies[0].content).toBe('reply 1');
      expect(replies[0].username).toBe('dicoding');
      expect(replies[0].isDeleted).toBe(false);
      expect(replies[0].date).toEqual(new Date('2014-01-01 10:11:56'));
    });
  });

  describe('deleteRply', () => {
    it("should throw notfound error when reply doesn't exist", async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-321',
        replyId: 'reply-321',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteReply.replyId))
        .rejects.toThrowError(NotFoundError);
    });

    it("should throw notfound error when comment doesn't exist", async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteReply.replyId))
        .rejects.toThrowError(NotFoundError);
    });

    it("should throw notfound error when thread doesn't exist", async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteReply.replyId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should change reply status isdeleted to true', async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteReply.replyId))
        .resolves.not.toThrowError(NotFoundError);

      const replyResult = await ReplyTableTestHelper.findRepliesById('reply-123');
      expect(replyResult[0].isdeleted).toEqual(true);
    });
  });

  describe('checkReplyExistence', () => {
    it('should throw NotFound error when replies not exist', async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-321',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.checkReplyExistence(deleteReply.replyId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFound error when replies not exist', async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.checkReplyExistence(deleteReply.replyId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyOwner', () => {
    it('should throw AuthorizationError error when not the owner', async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwner(deleteReply))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw authorized error when not the owner', async () => {
      // Arange
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwner(deleteReply))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
