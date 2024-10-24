const FormReply = require('../FormReply');

describe('FormReply', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new FormReply(payload)).toThrowError('REPLY_FORM.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      content: 'content',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new FormReply(payload)).toThrowError('REPLY_FORM.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ReplyForm object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      content: 'content',
      owner: 'user-123',
    };

    // Action
    const reply = new FormReply(payload);

    // Assert
    expect(reply).toBeInstanceOf(FormReply);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.threadId).toEqual(payload.threadId);
    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
  });
});
