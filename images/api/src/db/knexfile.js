module.exports = {
  development: {
    client: 'pg',
    connection: {
      host:  process.env.POSTGRES_HOST, // Use the name of your PostgreSQL container
      user: process.env.POSTGRES_USER, // The PostgreSQL username you've configured
      password:  process.env.POSTGRES_PASSWORD, // The PostgreSQL password you've configured
      database:  process.env.POSTGRES_DB, // The PostgreSQL database name you've configured
    },
    migrations: {
      directory: './migrations', // Set the path to your migrations directory
    },
    seeds: {
      directory: './seeds', // Set the path to your seeds directory
    },
  },
};



  
  