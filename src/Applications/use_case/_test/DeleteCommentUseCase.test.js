const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'Dicoding',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrowError();

    // Assert
    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyOwner)
      .toBeCalledWith({ commentId: useCasePayload.commentId, owner: useCasePayload.owner });
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.commentId);
  });
});
