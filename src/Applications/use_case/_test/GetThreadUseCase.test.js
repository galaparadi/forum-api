const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/reply/entities/Reply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // Mocked value
    const mockedThread = new Thread({
      id: useCasePayload.threadId,
      title: 'thread awal',
      body: 'thread body',
      username: 'Dicoding',
      date: new Date('2014-01-01 10:11:56'),
    });

    const mockedComments = [
      new Comment({
        id: 'comment-123',
        username: 'dudung',
        date: new Date('2014-01-01 10:11:56'),
        content: 'comment 1',
        likeCount: 2,
        isDeleted: false,
      }),
      new Comment({
        id: 'comment-234',
        content: 'comment 2',
        username: 'dudung',
        date: new Date('2014-01-01 10:11:56'),
        likeCount: 1,
        isDeleted: false,
      }),
    ];

    const mockedReplies = [
      {
        commentId: 'comment-123',
        reply: new Reply({
          id: 'reply-1',
          content: 'reply 123',
          date: new Date('2014-01-01 10:11:56'),
          username: 'wowo',
          isDeleted: false,
        }),
      },
      {
        commentId: 'comment-123',
        reply: new Reply({
          id: 'reply-2',
          content: 'reply 2',
          date: new Date('2014-01-01 10:11:56'),
          username: 'fufu',
          isDeleted: true,
        }),
      },
      {
        commentId: 'comment-234',
        reply: new Reply({
          id: 'reply-3',
          content: 'reply 3',
          date: new Date('2014-01-01 10:11:56'),
          username: 'wiwi',
          isDeleted: false,
        }),
      },

    ];

    // Expected result
    const expectedResult = new Thread({
      id: 'thread-123',
      title: 'thread awal',
      body: 'thread body',
      username: 'Dicoding',
      date: new Date('2014-01-01 10:11:56'),
    });

    const expectedComments = [
      {
        id: 'comment-123',
        content: 'comment 1',
        username: 'dudung',
        date: new Date('2014-01-01 10:11:56'),
        likeCount: 2,
        replies: [
          {
            id: 'reply-1',
            content: 'reply 123',
            date: new Date('2014-01-01 10:11:56'),
            username: 'wowo',
          },
          {
            id: 'reply-2',
            content: '**balasan telah dihapus**',
            date: new Date('2014-01-01 10:11:56'),
            username: 'fufu',
          },
        ],
      },
      {
        id: 'comment-234',
        content: 'comment 2',
        username: 'dudung',
        date: new Date('2014-01-01 10:11:56'),
        likeCount: 1,
        replies: [
          {
            id: 'reply-3',
            content: 'reply 3',
            date: new Date('2014-01-01 10:11:56'),
            username: 'wiwi',
          },
        ],
      },
    ];
    expectedResult.comments = expectedComments;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedThread));
    mockCommentRepository.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedComments));
    mockReplyRepository.getRepliesFromCommentList = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedReplies));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(expectedResult);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsFromThread)
      .toBeCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesFromCommentList)
      .toBeCalledWith(['comment-123', 'comment-234']);
  });
});
