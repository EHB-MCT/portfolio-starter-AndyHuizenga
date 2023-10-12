module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'db', // Use the name of your PostgreSQL container
        user: 'admin', // The PostgreSQL username you've configured
        password: 'admin', // The PostgreSQL password you've configured
        database: 'D_DB', // The PostgreSQL database name you've configured
      },
      migrations: {
        directory: './migrations', // Set the path to your migrations directory
      },
      seeds: {
        directory: './seeds', // Set the path to your seeds directory
      },
    },
  };

  