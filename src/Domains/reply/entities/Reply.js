class Reply {
  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.content = payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.isDeleted = payload.isDeleted;
    this._hideDeletedContent();
  }

  _verifyPayload({
    id, content, date, username, isDeleted,
  }) {
    if (!id || !content || !date || !username || (isDeleted === undefined)) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date) || typeof isDeleted !== 'boolean' || typeof username !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _hideDeletedContent() {
    if (this.isDeleted) {
      this.content = '**balasan telah dihapus**';
    }
  }
}

module.exports = Reply;
