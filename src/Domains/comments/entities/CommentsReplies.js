const Reply = require('../../reply/entities/Reply');
const Comment = require('./Comment');

// TODO: entities for comments thread lengkap
class CommentsReplies {
  constructor() {
    this.comments = new Map();
  }

  pushComment(comment) {
    this._verifyCommentPayload(comment);
    if (!this.comments.has(comment.id)) {
      const {
        id, content, date, username, likeCount,
      } = comment;
      this.comments.set(comment.id, {
        id, content, date, username, likeCount, replies: new Map(),
      });
    }
  }

  pushReply(commentId, reply) {
    this._verifyReplyPayload(reply);
    const comment = this.comments.get(commentId);
    if (comment) {
      comment.replies.set(reply.id, reply);
    }
  }

  MapToArray() {
    return Array.from(this.comments.values()).map(({
      id, content, username, date, replies, likeCount,
    }) => {
      const repliesArray = Array.from(replies.values())
        .map(this._mapReplies)
        .sort((a, b) => a.date - b.date);
      return {
        id, content, username, date, likeCount, replies: repliesArray,
      };
    });
  }

  _mapReplies({
    id, content, date, username,
  }) {
    return {
      id, content, date, username,
    };
  }

  _verifyCommentPayload(comment) {
    if (!(comment instanceof Comment)) throw new Error('COMMENT_REPLIES.PAYLOAD_IS_NOT_INSTANCE_OF_COMMENT');
  }

  _verifyReplyPayload(reply) {
    if (!(reply instanceof Reply)) throw new Error('COMMENT_REPLIES.PAYLOAD_IS_NOT_INSTANCE_OF_REPLY');
  }
}

module.exports = CommentsReplies;
