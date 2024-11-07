const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const Comment = require('../../../Domains/comments/entities/Comment');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const Reply = require('../../../Domains/reply/entities/Reply');
const CommentLikeRepository = require('../../../Domains/comments-like/CommentLikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const threadDate = new Date();
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // Mocked value
    const mockedThread = new Thread({
      id: useCasePayload.threadId,
      title: 'thread awal',
      body: 'thread body',
      username: 'Dicoding',
      date: threadDate,
    });

    const mockedComments = [
      new Comment({
        id: 'comment-111',
        content: 'content1',
        date: new Date('2014-01-01 10:11:55'),
        username: 'dudung',
        isDeleted: true,
      }),
      new Comment({
        id: 'comment-123',
        content: 'content2',
        date: new Date('2014-01-01 10:11:56'),
        username: 'mamat',
        isDeleted: false,
      }),
    ];

    const mockedReply = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: new Date('2014-01-01 10:11:57'),
        content: 'content',
        isDeleted: false,
      }),
    ];

    // Expected result
    const mockResult = new Thread({
      id: useCasePayload.threadId,
      title: mockedThread.title,
      body: mockedThread.body,
      username: mockedThread.username,
      date: threadDate,
    });

    mockResult.comments = [
      new Comment({
        id: 'comment-111',
        content: 'content1',
        date: new Date('2014-01-01 10:11:55'),
        username: 'dudung',
        isDeleted: true,
      }),
      new Comment({
        id: 'comment-123',
        content: 'content2',
        date: new Date('2014-01-01 10:11:56'),
        username: 'mamat',
        isDeleted: false,
      }),
    ];

    mockResult.comments[0].likeCount = 1;
    mockResult.comments[0].replies = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: new Date('2014-01-01 10:11:57'),
        content: 'content',
        isDeleted: false,
      }),
    ];

    mockResult.comments[1].likeCount = 1;
    mockResult.comments[1].replies = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: new Date('2014-01-01 10:11:57'),
        content: 'content',
        isDeleted: false,
      }),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedThread));
    mockCommentRepository.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedComments));
    mockReplyRepository.getRepliesFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedReply));
    mockCommentLikeRepository.getLikeCount = jest.fn()
      .mockImplementation(() => Promise.resolve({ count: 1 }));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(mockResult);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsFromThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesFromComment)
      .toBeCalledTimes(mockedComments.length);
    expect(mockReplyRepository.getRepliesFromComment)
      .toBeCalledWith('comment-111');
    expect(mockReplyRepository.getRepliesFromComment)
      .toBeCalledWith('comment-123');
    expect(mockCommentLikeRepository.getLikeCount).toBeCalledWith('comment-111');
    expect(mockCommentLikeRepository.getLikeCount).toBeCalledWith('comment-123');
  });
});
