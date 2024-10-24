const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not containt needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      owner: 'user-123',
      date: new Date(),
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      username: 'Dicoding',
      date: '10-januari-2024',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      username: 'Dicoding',
      date: new Date(),
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread).toBeInstanceOf(Thread);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.username).toEqual(payload.username);
    expect(thread.date).toBeInstanceOf(Date);
    expect(Array.isArray(thread.comments)).toBe(true);
  });

  it('should throw error when push comment without containt needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      username: 'Dicoding',
      date: new Date(),
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'content ini',
      owner: 'user-123',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(() => thread.pushComment(commentPayload)).toThrowError('THREAD.COMMENT_DATA_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when push comment without valid data specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      username: 'Dicoding',
      date: new Date(),
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'content ini',
      username: 'user-123',
      date: '10-January-2024',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(() => thread.pushComment(commentPayload)).toThrowError('THREAD.NOT_MEET_COMMENT_DATA_TYPE_SPECIFICATION');
  });

  it('should push comment succesfuly', () => {
    // Arrange
    const currDate = new Date();

    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body mantap',
      username: 'Dicoding',
      date: currDate,
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'content ini',
      username: 'user-123',
      date: currDate,
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(() => thread.pushComment(commentPayload)).not.toThrowError();

    expect(thread).toBeInstanceOf(Thread);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.username).toEqual(payload.username);
    expect(thread.date).toEqual(currDate);
    expect(Array.isArray(thread.comments)).toBe(true);

    const comment = thread.comments[0];
    expect(comment.id).toEqual(commentPayload.id);
    expect(comment.content).toEqual(commentPayload.content);
    expect(comment.username).toEqual(commentPayload.username);
    expect(comment.date).toEqual(currDate);
  });
});
