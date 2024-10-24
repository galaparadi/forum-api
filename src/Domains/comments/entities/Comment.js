class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.content;
    this.replies = [];
    this.isDeleted = payload.isDeleted;
    this._hideDeletedContent();
  }

  _verifyPayload({
    id, username, content, date, isDeleted,
  }) {
    if (!id || !content || !username || !date || (isDeleted === undefined)) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
            || typeof content !== 'string'
            || typeof username !== 'string'
            || typeof isDeleted !== 'boolean'
            || !(date instanceof Date)
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _hideDeletedContent() {
    if (this.isDeleted) {
      this.content = '**komentar telah dihapus**';
    }
  }
}

module.exports = Comment;
