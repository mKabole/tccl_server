const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "localhost",
      user: "root",
      password: "",
      database: "tccl_db",
      connectTimeout: 60000
    },
    listPerPage: 20,
  };
  module.exports = config;