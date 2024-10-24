const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const SubmitComment = require('../../../Domains/comments/entities/SubmitComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const Comment = require('../../../Domains/comments/entities/Comment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should error when owner doesn\'t exist', async () => {
      // Arrange
      const submitComment = new SubmitComment({
        content: 'content',
        owner: 'user-321',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      expect(commentRepositoryPostgres.addComment(submitComment))
        .rejects.toThrowError();
    });

    it('should error when thread doesn\'t exist', async () => {
      // Arrange
      const submitComment = new SubmitComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-321',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      expect(commentRepositoryPostgres.addComment(submitComment))
        .rejects.toThrowError();
    });

    it('should add comment to database', async () => {
      // Arrange
      const submitComment = new SubmitComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      const newComment = await commentRepositoryPostgres.addComment(submitComment);
      expect(newComment.id).toBe('comment-123');
      expect(newComment.content).toBe('content');
      expect(newComment.owner).toBe('user-123');

      const coments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(coments).toHaveLength(1);
      expect(coments[0]).toHaveProperty('id', 'comment-123');
      expect(coments[0]).toHaveProperty('content', submitComment.content);
      expect(coments[0]).toHaveProperty('owner', submitComment.owner);
      expect(coments[0]).toHaveProperty('threadid', submitComment.threadId);
    });
  });

  describe('getCommentFromThread function', () => {
    it("should throw notfound error when thread doesn't exist", async () => {
      // Arange
      const threadId = 'thread-321';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      expect(commentRepositoryPostgres.getCommentsFromThread(threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should get comments from thread', async () => {
      // Arange
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      await CommentTableTestHelper.addComment({ id: 'comments-123', content: 'comment 1' });

      // Action & Assert
      const comments = await commentRepositoryPostgres.getCommentsFromThread(threadId);
      expect(Array.isArray(comments)).toBe(true);
      expect(comments).not.toBeInstanceOf(InvariantError);
      expect(comments.length).toBeGreaterThan(0);

      const [comment] = comments;
      expect(comment).toBeInstanceOf(Comment);
      expect(comment.id).toBe('comments-123');
      expect(comment.username).toBe('dicoding');
      expect(comment.isDeleted).toBe(false);
      expect(comment.content).toBe('comment 1');
      expect(comment.date).toEqual(new Date('2014-01-01 10:11:56'));
      expect(Array.isArray(comment.replies)).toBe(true);
    });
  });

  describe('deletedComment', () => {
    it("should throw notfound error when thread doesn't exist", async () => {
      // Arange
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(deleteComment.commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it("should throw notfound error when comment doesn't exist", async () => {
      // Arange
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(deleteComment.commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should change comment status isdeleted to true', async () => {
      // Arange

      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(deleteComment.commentId))
        .resolves.not.toThrowError(NotFoundError);

      const commentResult = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(commentResult[0].isdeleted).toEqual(true);
    });
  });

  describe('verifyComment', () => {
    it('should throw NotFound error when comment not found', async () => {
      // Arange
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-321' });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment(commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFound error when comment not found', async () => {
      // Arange
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyOwner', () => {
    it('should throw error when not the owner of comment', async () => {
      // Arange
      const comment = {
        commentId: 'comment-123',
        owner: 'user-321',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwner(comment))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when not the owner of comment', async () => {
      // Arange
      const comment = {
        commentId: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwner(comment))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
