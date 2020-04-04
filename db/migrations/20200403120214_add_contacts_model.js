
exports.up = function(knex) {
  return knex.schema.createTable("contacts", t => {
    t.increments('id')
    t.uuid("uuid")
    t.string("firstName")
    t.string("lastName")
    t.string('phoneNumber')
    t.uuid("user_id")
    t.foreign("user_id").references("users.uuid").onDelete("CASCADE")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("contacts")
};
