exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('comments', 'fk_comments_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments_owner');
};
