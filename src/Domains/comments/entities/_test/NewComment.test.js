const NewComment = require('../NewComment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      title: 'content',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: { content: 'content' },
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create SubmitComment entitie correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
    };

    // Action
    const comment = new NewComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(NewComment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.owner).toEqual(payload.owner);
  });
});
