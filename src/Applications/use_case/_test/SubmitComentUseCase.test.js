const UserRepository = require('../../../Domains/users/UserRepository');
const SubmitComentUseCase = require('../SubmitComentUseCase');
const SubmitComment = require('../../../Domains/comments/entities/SubmitComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('SubmitComentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the submit comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'judul',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      fullname: 'dicoding submission',
      username: 'dicoding',
    });

    const mockedComment = new NewComment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockUserRepository.checkUserExistenceById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedRegisteredUser));
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedComment));

    /** creating use case instance */
    const submitComentUseCase = new SubmitComentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const comment = await submitComentUseCase.execute(new SubmitComment(useCasePayload));

    // Assert
    expect(comment).toStrictEqual(new NewComment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
    }));

    expect(mockUserRepository.checkUserExistenceById)
      .toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new SubmitComment({
        content: 'judul',
        owner: 'user-123',
        threadId: 'thread-123',
      }));
  });
});
