const SubmitCommentUseCase = require('../../../../Applications/use_case/SubmitComentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentsHandler = this.postCommentsHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentsHandler(request, h) {
    const ownerUsername = request.auth.credentials.id;
    request.payload.owner = ownerUsername;
    request.payload.threadId = request.params.threadId;
    const submitCommentUseCase = this._container.getInstance(SubmitCommentUseCase.name);
    const addedComment = await submitCommentUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const owner = request.auth.credentials.id;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({
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

module.exports = CommentsHandler;
