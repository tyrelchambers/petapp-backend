
exports.up = function(knex) {
  return knex.schema.alterTable("serials", t => {
    t.uuid('user_id')
    t.foreign('user_id').references("users.uuid").onDelete("CASCADE")
  }).alterTable('vaccines', t => {
    t.uuid('serial_id')
    t.foreign("serial_id").references("serials.uuid").onDelete("CASCADE")
  })
};

exports.down = function(knex) {
  
};
