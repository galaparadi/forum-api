exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('replies', 'fk_replies_comment', 'FOREIGN KEY(commentid) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies_comment');
};
