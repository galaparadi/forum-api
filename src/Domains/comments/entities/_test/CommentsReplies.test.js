const Reply = require('../../../reply/entities/Reply');
const Comment = require('../Comment');
const CommentsReplies = require('../CommentsReplies');

describe('CommentsReplies entities', () => {
  it('should throw error when push invalid comment', () => {
    // Arrange
    const comment = {
      id: 'comment-123',
    };

    const comments = new CommentsReplies();

    // Action & Assert
    expect(() => comments.pushComment(comment)).toThrowError('COMMENT_REPLIES.PAYLOAD_IS_NOT_INSTANCE_OF_COMMENT');
  });

  it('should throw error when push invalid reply', () => {
    // Arrange
    const comment = new Comment({
      id: 'comment-123',
      username: 'dudung',
      date: new Date(),
      content: 'content',
      isDeleted: false,
    });

    const reply = {
      id: 'reply-123',
    };

    const comments = new CommentsReplies();

    // Action & Assert
    expect(() => comments.pushComment(comment)).not.toThrowError('COMMENT_REPLIES.PAYLOAD_IS_NOT_INSTANCE_OF_COMMENT');
    expect(() => comments.pushReply(comment.id, reply)).toThrowError('COMMENT_REPLIES.PAYLOAD_IS_NOT_INSTANCE_OF_REPLY');
  });

  it('should create CommentsReplies object correctly', () => {
    // Arrange
    const currDate = new Date();
    const comment = new Comment({
      id: 'comment-123',
      username: 'dudung',
      date: currDate,
      content: 'content',
      isDeleted: false,
    });

    const reply = new Reply({
      id: 'reply-123',
      content: 'reply 123',
      date: currDate,
      username: 'lah ya gak tau',
      isDeleted: false,
    });

    const expectedReply = new Reply({
      id: 'reply-123',
      content: 'reply 123',
      date: currDate,
      username: 'lah ya gak tau',
      isDeleted: false,
    });

    const reply2 = new Reply({
      id: 'reply-2',
      content: 'reply 2',
      date: currDate,
      username: 'lah kocak',
      isDeleted: false,
    });

    const expectedReply2 = new Reply({
      id: 'reply-2',
      content: 'reply 2',
      date: currDate,
      username: 'lah kocak',
      isDeleted: false,
    });

    // Action
    const commentList = new CommentsReplies();
    commentList.pushComment(comment);
    commentList.pushReply(comment.id, reply);
    commentList.pushReply(comment.id, reply2);

    // Assert
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('content');
    expect(comment.username).toEqual('dudung');
    expect(comment.isDeleted).toEqual(false);
    expect(comment.date).toEqual(currDate);

    expect(commentList.comments.get('comment-123').replies.get('reply-123')).toStrictEqual(expectedReply);
    expect(commentList.comments.get('comment-123').replies.get('reply-2')).toStrictEqual(expectedReply2);
  });

  it('should map to array correctly', () => {
    // Arrange
    const currDate = new Date();
    const comment = new Comment({
      id: 'comment-123',
      username: 'dudung',
      date: currDate,
      content: 'content',
      isDeleted: false,
      likeCount: 2,
    });

    const reply = new Reply({
      id: 'reply-123',
      content: 'reply 123',
      date: currDate,
      username: 'lah ya gak tau',
      isDeleted: false,
    });

    const reply2 = new Reply({
      id: 'reply-2',
      content: 'reply 2',
      date: currDate,
      username: 'lah kocak',
      isDeleted: false,
    });

    const expectedResult = [
      {
        id: 'comment-123',
        content: 'content',
        username: 'dudung',
        date: currDate,
        likeCount: 2,
        replies: [
          {
            id: 'reply-123',
            content: 'reply 123',
            date: currDate,
            username: 'lah ya gak tau',
          },
          {
            id: 'reply-2',
            content: 'reply 2',
            date: currDate,
            username: 'lah kocak',
          },
        ],
      },
    ];

    // Action
    const commentList = new CommentsReplies();
    commentList.pushComment(comment);
    commentList.pushReply(comment.id, reply);
    commentList.pushReply(comment.id, reply2);

    const result = commentList.MapToArray();

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });
});
