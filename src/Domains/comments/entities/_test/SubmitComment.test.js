const SubmitComment = require('../SubmitComment');

describe('SubmitComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'content',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new SubmitComment(payload)).toThrowError('SUBMIT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123456,
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new SubmitComment(payload)).toThrowError('SUBMIT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create SubmitComment entitie correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const submitComment = new SubmitComment(payload);

    // Assert
    expect(submitComment).toBeInstanceOf(SubmitComment);
    expect(submitComment.content).toEqual(payload.content);
    expect(submitComment.owner).toEqual(payload.owner);
    expect(submitComment.threadId).toEqual(payload.threadId);
  });
});
