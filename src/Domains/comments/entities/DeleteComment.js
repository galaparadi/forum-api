class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.commentId = payload.commentId;
    this.threadId = payload.threadId;
    this.owner = payload.owner;
  }

  _verifyPayload({ commentId, threadId, owner }) {
    if (!commentId || !threadId || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof commentId !== 'string'
            || typeof threadId !== 'string'
            || typeof owner !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
