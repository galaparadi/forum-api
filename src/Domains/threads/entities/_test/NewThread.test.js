const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 1234,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.id).toEqual(payload.id);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
