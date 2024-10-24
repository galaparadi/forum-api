const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
      username: 'dicoding',
      date: '10-january-2024',
      isDeleted: 'true',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return Reply object', () => {
    // Arrange
    const currDate = new Date();
    const payload = {
      id: 'reply-123',
      content: 'content',
      username: 'dicoding',
      date: currDate,
      isDeleted: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.isDeleted).toEqual(payload.isDeleted);
  });

  it('should hide deleted content Reply object', () => {
    // Arrange
    const currDate = new Date();
    const payload = {
      id: 'reply-123',
      content: 'content',
      username: 'dicoding',
      date: currDate,
      isDeleted: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toBe('**balasan telah dihapus**');
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.isDeleted).toEqual(payload.isDeleted);
  });
});
