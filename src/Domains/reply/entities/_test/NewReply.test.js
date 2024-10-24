const NewReply = require('../NewReply');

describe('NewReply', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ReplyForm object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
    };

    // Action
    const reply = new NewReply(payload);

    // Assert
    expect(reply).toBeInstanceOf(NewReply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
  });
});
