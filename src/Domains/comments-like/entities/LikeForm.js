class LikeForm {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  _verifyPayload({ commentId, owner }) {
    if (!commentId || !owner) {
      throw new Error('LIKE_FORM.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('LIKE_FORM.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeForm;
