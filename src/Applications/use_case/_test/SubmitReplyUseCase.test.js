const CommentRepository = require('../../../Domains/comments/CommentRepository');
const FormReply = require('../../../Domains/reply/entities/FormReply');
const NewReply = require('../../../Domains/reply/entities/NewReply');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const SubmitReplyUseCase = require('../SubmitReplyUseCase');

describe('SubmitReplyUseCase', () => {
  it('should orchestrating the submit reply action correctly', async () => {
    // Arrange
    const useCasePayload = new FormReply({
      commentId: 'comment-123',
      threadId: 'thread-123',
      content: 'content',
      owner: 'user-123',
    });

    const mockedNewReply = new NewReply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
    });

    const mockedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      fullname: 'dicoding submission',
      username: 'dicoding',
    });

    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockUserRepository.checkUserExistenceById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedRegisteredUser));
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedNewReply));

    // create use case instance
    const submitReplyUseCase = new SubmitReplyUseCase({
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const newReply = await submitReplyUseCase.execute(useCasePayload);

    // Assert
    expect(newReply).toEqual(new NewReply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
    }));

    expect(mockUserRepository.checkUserExistenceById)
      .toBeCalledWith('user-123');
    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith('comment-123');
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new FormReply({
        commentId: 'comment-123',
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      }));
  });
});
