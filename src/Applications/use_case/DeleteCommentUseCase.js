const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { owner, commentId, threadId } = new DeleteComment(useCasePayload);
    await this.threadRepository.verifyThread(threadId);
    await this.commentRepository.verifyComment(commentId);
    await this.commentRepository.verifyOwner({ commentId, owner });
    await this.commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
