/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments-like', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    commentid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    isliked: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint('comments-like', 'unique_comments_like', 'UNIQUE(commentid, owner)');
};

exports.down = (pgm) => {
  pgm.dropTable('comments-like');
};
