const SubmitReplyUseCase = require('../../../../Applications/use_case/SubmitReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const owner = request.auth.credentials.id;
    const submitReplyUseCase = this._container.getInstance(SubmitReplyUseCase.name);
    const addedReply = await submitReplyUseCase.execute({
      owner,
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      content: request.payload.content,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const owner = request.auth.credentials.id;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({
      owner,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
    });
    return h.response({ status: 'success' });
  }
}

module.exports = RepliesHandler;
