const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'Dicoding',
      content: 'content',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'Dicoding',
      content: 'content',
      date: '10-januari-2024',
      isDeleted: 'true',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const currDate = new Date();
    const payload = {
      id: 'thread-123',
      username: 'Dicoding',
      content: 'content',
      date: currDate,
      isDeleted: false,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.date);
    expect(comment.isDeleted).toEqual(payload.isDeleted);
  });

  it('should hide content correctly', () => {
    // Arrange
    const currDate = new Date();
    const payload = {
      id: 'thread-123',
      username: 'Dicoding',
      content: 'content',
      date: currDate,
      isDeleted: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toBe('**komentar telah dihapus**');
    expect(comment.date).toEqual(payload.date);
    expect(comment.isDeleted).toEqual(payload.isDeleted);
  });
});
