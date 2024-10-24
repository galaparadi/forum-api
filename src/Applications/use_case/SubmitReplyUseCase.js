const FormReply = require('../../Domains/reply/entities/FormReply');

class SubmitReplyUseCase {
  constructor({
    commentRepository, threadRepository, replyRepository, userRepository,
  }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
    this.replyRepository = replyRepository;
    this.userRepository = userRepository;
  }

  async execute(payload) {
    const formReply = new FormReply(payload);
    await this.userRepository.checkUserExistenceById(formReply.owner);
    await this.threadRepository.verifyThread(formReply.threadId);
    await this.commentRepository.verifyComment(formReply.commentId);
    const newReply = await this.replyRepository.addReply(formReply);
    return newReply;
  }
}

module.exports = SubmitReplyUseCase;
