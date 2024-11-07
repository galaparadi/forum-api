const CommentLikeRepository = require('../../Domains/comments-like/CommentLikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verfyUserLiked(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: 'SELECT id FROM "comments-like" WHERE commentid = $1 AND owner = $2 AND isliked = true',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);
    if (rowCount > 0) return true;
    return false;
  }

  async likeComment(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: 'UPDATE "comments-like" set isliked = $1 WHERE commentid = $2 AND owner = $3 RETURNING *',
      values: [true, commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount < 1) {
      throw new NotFoundError('like data not found');
    }
  }

  async unLikeComment(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: 'UPDATE "comments-like" set isliked = $1 WHERE commentid = $2 AND owner = $3 RETURNING *',
      values: [false, commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount < 1) {
      throw new NotFoundError('like data not found');
    }
  }

  async getLikeCount(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM "comments-like" WHERE commentid = $1 AND isliked = true',
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async initLikeComment(payload) {
    const { commentId, owner } = payload;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO "comments-like" VALUES($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT unique_comments_like DO NOTHING',
      values: [id, commentId, owner, new Date()],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
