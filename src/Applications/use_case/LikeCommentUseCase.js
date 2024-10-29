const LikeForm = require('../../Domains/comments-like/entities/LikeForm');

class LikeCommentUseCase {
  constructor({
    userRepository, commentRepository, threadRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    const form = new LikeForm(useCasePayload);

    await this._threadRepository.verifyThread(threadId);
    await this._userRepository.checkUserExistenceById(owner);
    await this._commentRepository.verifyComment(commentId);

    await this._commentLikeRepository.initLikeComment(form);
    if (await this._commentLikeRepository.verfyUserLiked(form)) {
      await this._commentLikeRepository.unLikeComment(form);
    } else {
      await this._commentLikeRepository.likeComment(form);
    }
  }
}

module.exports = LikeCommentUseCase;
