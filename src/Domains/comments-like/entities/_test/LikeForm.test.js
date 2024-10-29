const LikeForm = require('../LikeForm');

describe('LikeForm Entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      title: 'judul',
    };

    // Action & Assert
    expect(() => new LikeForm(payload)).toThrowError('LIKE_FORM.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new LikeForm(payload)).toThrowError('LIKE_FORM.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LikeForm object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const likeForm = new LikeForm(payload);

    // Assert
    expect(likeForm).toBeInstanceOf(LikeForm);
    expect(likeForm.commentId).toEqual(payload.commentId);
    expect(likeForm.owner).toEqual(payload.owner);
  });
});
