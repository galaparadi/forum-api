const FormThread = require('../FormThread');

describe('FormThread Entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      title: 'judul',
    };

    // Action & Assert
    expect(() => new FormThread(payload)).toThrowError('FORM_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'judul',
      body: 1234,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new FormThread(payload)).toThrowError('FORM_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create FormThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'judul',
      body: 'body mantap',
      owner: 'user-123',
    };

    // Action
    const formThread = new FormThread(payload);

    // Assert
    expect(formThread).toBeInstanceOf(FormThread);
    expect(formThread.title).toEqual(payload.title);
    expect(formThread.body).toEqual(payload.body);
    expect(formThread.owner).toEqual(payload.owner);
  });
});
