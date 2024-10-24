const DeleteReply = require('../../Domains/reply/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this.replyRepository = replyRepository;
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = new DeleteReply(useCasePayload);
    await this.threadRepository.verifyThread(threadId);
    await this.commentRepository.verifyComment(commentId);
    await this.replyRepository.checkReplyExistence(replyId);
    await this.replyRepository.verifyOwner({ replyId, owner });
    await this.replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
