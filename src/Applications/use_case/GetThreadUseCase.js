const CommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = new Thread(await this._threadRepository.getThread(threadId));
    const comments = await this._commentRepository.getCommentsFromThread(threadId);
    const replies = await this._replyRepository
      .getRepliesFromCommentList(comments.map((comment) => comment.id));

    const commentReply = new CommentsReplies();
    comments.forEach((comment) => {
      commentReply.pushComment(comment);
    });
    replies.forEach((item) => {
      const { commentId, reply } = item;
      commentReply.pushReply(commentId, reply);
    });

    thread.comments = commentReply.MapToArray().sort((a, b) => a.date - b.date);

    return thread;
  }
}

module.exports = GetThreadUseCase;
