/* eslint no-unused-vars: 0 */

class ReplyRepository {
  async addReply(replyForm) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesFromComment(commentId) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(deleteReply) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplyExistence(replyId) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyOwner(user) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
