const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikeCommentsHandler {
  constructor(container) {
    this._container = container;
    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async likeCommentHandler(request, h) {
    const owner = request.auth.credentials.id;
    const likecommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likecommentUseCase.execute({
      owner,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    });
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = LikeCommentsHandler;
