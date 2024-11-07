exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('comments', 'fk_comments_thread', 'FOREIGN KEY(threadid) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments_thread');
};
