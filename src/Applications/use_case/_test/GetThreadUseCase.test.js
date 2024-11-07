const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/reply/entities/Reply');
const CommentsReplies = require('../../../Domains/comments/entities/CommentsReplies');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // TODO: update use case using new repository method
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

    const mockedCommentsReplies = new CommentsReplies();

    mockedCommentsReplies.pushComment(new Comment({
      id: 'comment-123',
      username: 'dudung',
      date: new Date('2014-01-01 10:11:56'),
      content: 'comment 1',
      likeCount: 2,
      isDeleted: false,
    }));

    mockedCommentsReplies.pushReply('comment-123', new Reply({
      id: 'reply-1',
      content: 'reply 123',
      date: new Date('2014-01-01 10:11:56'),
      username: 'wowo',
      isDeleted: false,
    }));
    mockedCommentsReplies.pushReply('comment-123', new Reply({
      id: 'reply-2',
      content: 'reply 2',
      date: new Date('2014-01-01 10:11:56'),
      username: 'fufu',
      isDeleted: true,
    }));

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
    ];
    expectedResult.comments = expectedComments;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedThread));
    mockCommentRepository.getCommentsAndReplyFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedCommentsReplies));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(expectedResult);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsAndReplyFromThread)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
