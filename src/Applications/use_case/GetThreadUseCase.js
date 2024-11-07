const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = new Thread(await this._threadRepository.getThread(threadId));
    const comments = await this._commentRepository.getCommentsAndReplyFromThread(threadId);
    thread.comments = comments.MapToArray().sort((a, b) => a.date - b.date);

    return thread;
  }
}

module.exports = GetThreadUseCase;
