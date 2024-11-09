const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');
const NewComment = require('../../Domains/comments/entities/NewComment');
const SubmitComment = require('../../Domains/comments/entities/SubmitComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = new SubmitComment(newComment);
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, content, owner, new Date(), threadId, false],
    };

    const result = await this._pool.query(query);
    const thread = new NewComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
    return thread;
  }

  async getCommentsFromThread(threadId) {
    const query = {
      text: `SELECT COALESCE(likes.likescount,0) as likescount, comments.isdeleted, comments.id, users.username, comments.date, comments.content 
          FROM comments 
          INNER JOIN users ON users.id = comments.owner
          LEFT JOIN (
              SELECT 
                count(commentid)::int as likescount, 
                comments.id, 
                comments.content
              FROM "comments-like"
              INNER JOIN comments ON comments.id = "comments-like".commentid
              WHERE isliked = TRUE
              GROUP BY commentid, comments.id
          ) AS likes ON likes.id = comments.id
          WHERE threadid = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows.map((comment) => new Comment({
      id: comment.id,
      username: comment.username,
      date: new Date(comment.date),
      content: comment.content,
      isDeleted: comment.isdeleted,
      likeCount: comment.likescount,
    }));
  }

  async verifyComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE owner = $2 AND id = $1',
      values: [commentId, owner],

    };
    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new AuthorizationError('bukan pemilik comment');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET isdeleted = true WHERE id = $1 RETURNING *',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('tidak dapat delete. comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
