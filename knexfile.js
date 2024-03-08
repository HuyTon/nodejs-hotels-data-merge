module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      password: "123456789",
      database: "hotels",
    },
    migrations: {
      tableName: "api_keys",
    },
  },
};
