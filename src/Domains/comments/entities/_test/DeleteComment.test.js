const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 123,
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    // Arange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.threadId).toEqual('thread-123');
    expect(deleteComment.commentId).toEqual('comment-123');
    expect(deleteComment.owner).toEqual('user-123');
  });
});
