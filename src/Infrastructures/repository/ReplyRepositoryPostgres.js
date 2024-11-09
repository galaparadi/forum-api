const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const FormReply = require('../../Domains/reply/entities/FormReply');
const NewReply = require('../../Domains/reply/entities/NewReply');
const Reply = require('../../Domains/reply/entities/Reply');
const ReplyRepository = require('../../Domains/reply/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(formReply) {
    const { content, commentId, owner } = new FormReply(formReply);
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, new Date(), commentId, false],
    };

    const result = await this._pool.query(query);
    const newReply = new NewReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
    return newReply;
  }

  async getRepliesFromComment(commentId) {
    const query = {
      text: 'SELECT replies.isdeleted, replies.id, users.username, replies.date, replies.content FROM replies INNER JOIN users ON users.id = replies.owner WHERE commentid = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const replyList = [];

    result.rows.forEach((reply) => {
      replyList.push(new Reply({
        id: reply.id,
        username: reply.username,
        date: new Date(reply.date),
        content: reply.content,
        isDeleted: reply.isdeleted,
      }));
    });

    return replyList;
  }

  async getRepliesFromCommentList(comments) {
    if (!Array.isArray(comments)) throw new Error('REPLY_REPOSITORY_POSTGRES.GET_REPLIES_FROM_COMMENTLIST.NOT_MEET_PAYLOAD_DATA_TYPE');

    const query = {
      text: `
      SELECT commentid, replies.isdeleted, replies.id, users.username, replies.date, replies.content
      FROM replies
      INNER JOIN users ON users.id = replies.owner
      WHERE commentid = ANY($1::text[])
      ORDER BY id
      `,
      values: [comments],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((row) => ({
      commentId: row.commentid,
      reply: new Reply({
        ...row,
        isDeleted: row.isdeleted,
        date: new Date(row.date),
      }),
    }));
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET isdeleted = true WHERE id = $1 RETURNING *',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('tidak dapat delete. reply tidak ditemukan');
    }
  }

  async verifyOwner({ replyId, owner }) {
    const query = {
      text: 'SELECT id FROM replies WHERE owner = $2 AND id = $1',
      values: [replyId, owner],

    };
    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new AuthorizationError('bukan pemilik reply');
    }
  }

  async checkReplyExistence(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],

    };
    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
