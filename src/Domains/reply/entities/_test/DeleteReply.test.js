const DeleteReply = require('../DeleteReply');

describe('DeleteReply', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ReplyForm object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action
    const reply = new DeleteReply(payload);

    // Assert
    expect(reply).toBeInstanceOf(DeleteReply);
    expect(reply.threadId).toEqual(payload.threadId);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.replyId).toEqual(payload.replyId);
    expect(reply.owner).toEqual(payload.owner);
  });
});
