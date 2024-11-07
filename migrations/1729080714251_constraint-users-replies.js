exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('replies', 'fk_replies_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies_owner');
};
