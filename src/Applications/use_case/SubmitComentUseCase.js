const SubmitComment = require('../../Domains/comments/entities/SubmitComment');

class SubmitCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(commentPayload) {
    const submitComent = new SubmitComment(commentPayload);

    await this._userRepository.checkUserExistenceById(submitComent.owner);
    await this._threadRepository.verifyThread(submitComent.threadId);
    const result = await this._commentRepository.addComment(submitComent);
    return result;
  }
}

module.exports = SubmitCommentUseCase;
