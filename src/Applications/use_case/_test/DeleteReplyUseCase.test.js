const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'Dicoding',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyExistence = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).resolves.not.toThrowError();

    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.checkReplyExistence)
      .toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyOwner)
      .toBeCalledWith({ replyId: useCasePayload.replyId, owner: useCasePayload.owner });
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCasePayload.replyId);
  });
});
