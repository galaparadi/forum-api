const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve);

    const usecase = new LikeCommentUseCase();

    await expect(usecase.execute(useCasePayload)).resolves.not.toThrowError();
    expect(mockCommentRepository.verifyComment).toBeCalledWith('comment-123');
  });
});
