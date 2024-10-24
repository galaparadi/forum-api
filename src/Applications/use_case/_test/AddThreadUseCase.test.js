const AddThreadUseCase = require('../AddThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const FromThread = require('../../../Domains/threads/entities/FormThread');
const UserRepository = require('../../../Domains/users/UserRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('AddThreadUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'judul',
      body: 'body',
      owner: 'user-123',
    };

    const currentDate = new Date();
    const mockedThread = new NewThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
      date: currentDate,
    });
    const mockedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      fullname: 'dicoding submission',
      username: 'dicoding',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedThread));
    mockUserRepository.checkUserExistenceById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedRegisteredUser));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const newThread = await addThreadUseCase.execute(new FromThread(useCasePayload));

    // Assert
    expect(newThread).toStrictEqual(new NewThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
      date: currentDate,
    }));

    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new FromThread({
        title: 'judul',
        body: 'body',
        owner: 'user-123',
      }));
    expect(mockUserRepository.checkUserExistenceById)
      .toBeCalledWith('user-123');
  });
});
