const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentLikeRepository = require('../../../Domains/comments-like/CommentLikeRepository');
const LikeForm = require('../../../Domains/comments-like/entities/LikeForm');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action when liking correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve);
    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve);
    mockUserRepository.checkUserExistenceById = jest.fn().mockImplementation(() => Promise.resolve);
    mockCommentLikeRepository.verfyUserLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.initLikeComment = jest.fn().mockImplementation(() => Promise.resolve);
    mockCommentLikeRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve);

    const usecase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await expect(usecase.execute(useCasePayload)).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyComment).toBeCalledWith('comment-123');
    expect(mockUserRepository.checkUserExistenceById).toBeCalledWith('user-123');
    expect(mockCommentLikeRepository.initLikeComment).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
    expect(mockCommentLikeRepository.verfyUserLiked).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
    expect(mockCommentLikeRepository.likeComment).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
  });

  it('should orchestrating the like comment action when unliking correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve);
    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve);
    mockUserRepository.checkUserExistenceById = jest.fn().mockImplementation(() => Promise.resolve);
    mockCommentLikeRepository.initLikeComment = jest.fn().mockImplementation(() => Promise.resolve);
    mockCommentLikeRepository.verfyUserLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.unLikeComment = jest.fn().mockImplementation(() => Promise.resolve);

    const usecase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await expect(usecase.execute(useCasePayload)).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyComment).toBeCalledWith('comment-123');
    expect(mockUserRepository.checkUserExistenceById).toBeCalledWith('user-123');
    expect(mockCommentLikeRepository.initLikeComment).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
    expect(mockCommentLikeRepository.verfyUserLiked).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
    expect(mockCommentLikeRepository.unLikeComment).toBeCalledWith(new LikeForm({ commentId: 'comment-123', owner: 'user-123' }));
  });
});
