const FormThread = require('../../Domains/threads/entities/FormThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const newThread = new FormThread(useCasePayload);

    await this._userRepository.checkUserExistenceById(newThread.owner);
    const result = await this._threadRepository.addThread(newThread);
    return result;
  }
}

module.exports = AddThreadUseCase;
