const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = new Thread(await this._threadRepository.getThread(threadId));
    const comments = await this._commentRepository.getCommentsFromThread(threadId);

    /* eslint no-await-in-loop: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const comment of comments) {
      try {
        const replies = await this._replyRepository.getRepliesFromComment(comment.id);
        replies.forEach((reply) => {
          comment.replies.push(reply);
          comment.replies.sort((replyA, replyB) => replyA.date - replyB.date);
        });
      } catch (error) {
        // DO nothing. Just skip and continue.
      }
      comment.likeCount = (await this._commentLikeRepository.getLikeCount(comment.id)).count;
      thread.comments.push(comment);
      thread.comments.sort((commentA, commentB) => commentA.date - commentB.date);
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
