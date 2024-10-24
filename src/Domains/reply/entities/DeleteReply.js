class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.replyId = payload.replyId;
    this.owner = payload.owner;
  }

  _verifyPayload({
    threadId, commentId, replyId, owner,
  }) {
    if (!replyId || !threadId || !commentId || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
