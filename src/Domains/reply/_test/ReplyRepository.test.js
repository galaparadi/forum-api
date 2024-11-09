const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReply({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.checkReplyExistence({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyOwner({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getRepliesFromComment({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getRepliesFromCommentList({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
  });
});
