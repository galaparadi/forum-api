const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');
const CommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const NewComment = require('../../Domains/comments/entities/NewComment');
const SubmitComment = require('../../Domains/comments/entities/SubmitComment');
const Reply = require('../../Domains/reply/entities/Reply');

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

  async getCommentsAndReplyFromThread(threadId) {
    const query = {
      text: `
      SELECT 
          comments.comment_id,
          comments.content as comment_content,
          comments.comment_date,
          comments.username as comment_owner,
          COALESCE(comments.likescount,0) as likescount,
          comments.comments_isdeleted,
          replies.id as replies_id,
          replies.username as replies_owner,
          replies.content as replies_content,
          replies.replies_date,
          replies.replies_isdeleted
      FROM (
          SELECT 
          likes.likescount,
          comments.id as comment_id,
          comments.content,
          comments.date as comment_date, 
          comments.isdeleted as comments_isdeleted, 
          users.username
          FROM comments
          INNER JOIN users ON comments.owner = users.id
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
          WHERE comments.threadid = $1
      ) AS comments
      LEFT JOIN (
          SELECT 
            replies.commentid, 
            replies.id, 
            replies.content,
            replies.date as replies_date,
            replies.isdeleted as replies_isdeleted,
            users.username
          FROM replies
          INNER JOIN users on replies.owner = users.id
      ) AS replies
      ON comments.comment_id = replies.commentid
      ORDER BY comment_date;
      `,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    if (rows.length < 1) {
      return [];
    }

    const commentList = new CommentsReplies();
    rows.forEach((row) => {
      commentList.pushComment(new Comment({
        id: row.comment_id,
        date: new Date(row.comment_date),
        username: row.comment_owner,
        content: row.comment_content,
        isDeleted: row.comments_isdeleted,
        likeCount: row.likescount,
      }));

      if (row.replies_id === null) return;
      commentList.pushReply(row.comment_id, new Reply({
        id: row.replies_id,
        username: row.replies_owner,
        content: row.replies_content,
        date: new Date(row.replies_date),
        isDeleted: row.replies_isdeleted,
      }));
    });

    return commentList;
  }

  async getCommentsFromThread(threadId) {
    const query = {
      text: 'SELECT comments.isdeleted, comments.id, users.username, comments.date, comments.content FROM comments INNER JOIN users ON users.id = comments.owner WHERE threadid = $1',
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
