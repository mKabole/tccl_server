const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "http://196.46.192.209",
      user: "phpmyadmin",
      password: "209@Tccl2023",
      database: "tccl_db",
      connectTimeout: 60000
    },
    listPerPage: 20,
  };
  module.exports = config;