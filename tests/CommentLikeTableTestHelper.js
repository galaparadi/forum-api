/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addLike({
    id = 'like-123', commentId = 'comments-123', owner = 'user-123', date = new Date('2014-01-01 10:11:56'), isliked = false,
  }) {
    const query = {
      text: 'INSERT INTO "comments-like" VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, owner, date, isliked],
    };

    await pool.query(query);
  },

  async findLikesById(id) {
    const query = {
      text: 'SELECT * FROM "comments-like" WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikesByCommentId(id) {
    const query = {
      text: 'SELECT * FROM "comments-like" WHERE commentid = $1 AND isliked = true',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findDislikesByCommentId(id) {
    const query = {
      text: 'SELECT * FROM "comments-like" WHERE commentid = $1 AND isliked = false',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM "comments-like" WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
