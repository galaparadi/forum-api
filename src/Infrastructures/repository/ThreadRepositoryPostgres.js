const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const FormThread = require('../../Domains/threads/entities/FormThread');
const NewThread = require('../../Domains/threads/entities/NewThread');
const Thread = require('../../Domains/threads/entities/Thread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = new FormThread(newThread);
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date()],
    };

    const result = await this._pool.query(query);
    return new NewThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].owner,
    });
  }

  async verifyThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(id) {
    const query = {
      text: 'SELECT threads.id, threads.date, threads.title, threads.body, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new Thread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      username: result.rows[0].username,
      date: new Date(result.rows[0].date),
    });
  }
}

module.exports = ThreadRepositoryPostgres;
