exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('comments-like', 'fk-comment-like', 'FOREIGN KEY(commentid) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments-like', 'fk-comment-like');
};
