const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const LikeForm = require('../../../Domains/comments-like/entities/LikeForm');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadTableTestHelper.addThread({ id: 'thread-123' });
    await CommentTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentLikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('initLikeComment', () => {
    it('should error when owner doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-321',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.initLikeComment(likePayload))
        .rejects.toThrowError();
    });

    it('should error when comment doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-321',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.initLikeComment(likePayload))
        .rejects.toThrowError();
    });

    it('should saved like comment data to database', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.initLikeComment(likePayload))
        .resolves.not.toThrowError();

      const likes = await CommentLikeTableTestHelper.findLikesById('like-123');
      expect(likes.length).toBeGreaterThan(0);
      expect(likes[0].commentid).toBe('comments-123');
      expect(likes[0].owner).toBe('user-123');
      expect(likes[0].isliked).toBe(false);
    });
  });

  describe('verfyUserLiked', () => {
    it('should return true if user liked comment', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: true });

      // Action & Assert
      const isliked = await repository.verfyUserLiked(likePayload);

      expect(isliked).toBe(true);
    });

    it('should return false if user unliked comment', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ });

      // Action & Assert
      const isliked = await repository.verfyUserLiked(likePayload);

      expect(isliked).toBe(false);
    });
  });

  describe('likeComment', () => {
    it('should error when owner doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-321',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.likeComment(likePayload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should error when comment doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-321',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.likeComment(likePayload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error and change comment liked status to true', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: false });

      // Action & Assert
      await expect(repository.likeComment(likePayload))
        .resolves.not.toThrowError();

      const likes = await CommentLikeTableTestHelper.findLikesById('like-123');
      expect(likes[0].isliked).toBe(true);
    });

    it('should not throw error and comment liked status not changed if already liked', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: true });

      // Action & Assert
      await expect(repository.likeComment(likePayload))
        .resolves.not.toThrowError();

      const likes = await CommentLikeTableTestHelper.findLikesById('like-123');
      expect(likes[0].isliked).toBe(true);
    });
  });

  describe('getLikeCount', () => {
    it('should return 0 when comment doesn\'t exist', async () => {
      // Arange
      const commentId = 'comments-321';
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      const { count } = await repository.getLikeCount(commentId);
      expect(count).toBe(0);
    });

    it('should return 1 when there\'s liked comment', async () => {
      // Arange
      const commentId = 'comments-123';
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: true });

      // Action & Assert
      const { count } = await repository.getLikeCount(commentId);
      expect(count).toBe(1);
    });

    it('should return 1 when there\'s liked comment and unliked comment', async () => {
      // Arange
      const commentId = 'comments-123';
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: true });

      // New user dislike the comment
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'jaya' });
      await CommentLikeTableTestHelper.addLike({ id: 'like-321', owner: 'user-321', isliked: false });

      // Action & Assert
      const { count } = await repository.getLikeCount(commentId);
      expect(count).toBe(1);
    });
  });

  describe('unLikeComment', () => {
    it('should error when owner doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-321',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.unLikeComment(likePayload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should error when comment doesn\'t exist', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-321',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repository.unLikeComment(likePayload))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error and change comment liked status to false', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: true });

      // Action & Assert
      await expect(repository.unLikeComment(likePayload))
        .resolves.not.toThrowError();

      const likes = await CommentLikeTableTestHelper.findLikesById('like-123');
      expect(likes[0].isliked).toBe(false);
    });

    it('should not throw error and comment liked status not changed if already unliked', async () => {
      // Arange
      const likePayload = new LikeForm({
        owner: 'user-123',
        commentId: 'comments-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await CommentLikeTableTestHelper.addLike({ isliked: false });

      // Action & Assert
      await expect(repository.unLikeComment(likePayload))
        .resolves.not.toThrowError();

      const likes = await CommentLikeTableTestHelper.findLikesById('like-123');
      expect(likes[0].isliked).toBe(false);
    });
  });
});
