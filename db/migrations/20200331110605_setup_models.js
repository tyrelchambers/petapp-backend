
exports.up = function(knex) {
  return knex.schema.createTable("users", t=> {
    t.increments('id')
    t.uuid("uuid").unique()
    t.string("email").unique()
    t.string("password").notNullable()
    t.string("firstName")
    t.string("lastName")
    t.string("phoneNumber")
  }).createTable("serials", t => {
    t.increments('id')
    t.uuid("uuid").unique()
    t.string("petName")
    t.string("breed")
    t.string("serialNumber").unique()
  }).createTable("vaccines", t=> {
    t.increments('id')
    t.uuid("uuid").unique()
    t.string("type")
    t.date("administered")
    t.date("expiry")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("users").dropTable("serials").dropTable("vaccines")
};


