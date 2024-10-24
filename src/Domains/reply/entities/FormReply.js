class FormReply {
  constructor(payload) {
    this._verifyPayload(payload);
    this.commentId = payload.commentId;
    this.threadId = payload.threadId;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyPayload({
    commentId, content, owner, threadId,
  }) {
    if (!commentId || !content || !owner || !threadId) {
      throw new Error('REPLY_FORM.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error('REPLY_FORM.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = FormReply;
