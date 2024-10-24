class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.username = payload.username;
    this.date = payload.date;
    this.comments = [];
  }

  _verifyPayload({
    id, title, body, username, date,
  }) {
    if (!id || !title || !body || !username || !date) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
            || typeof title !== 'string'
            || typeof body !== 'string'
            || typeof username !== 'string'
            || !(date instanceof Date)
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  pushComment(comment) {
    this._verifyComment(comment);
    this.comments.push(comment);
  }

  _verifyComment({
    id, content, date, username,
  }) {
    if (!content || !date || !id || !username) {
      throw new Error('THREAD.COMMENT_DATA_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof username !== 'string' || !(date instanceof Date)) {
      throw new Error('THREAD.NOT_MEET_COMMENT_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
