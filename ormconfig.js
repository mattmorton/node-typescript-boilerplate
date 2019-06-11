module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: [
    __dirname + '/src/entity/*.entity.ts'
  ],
  subscribers: [
    __dirname + '/src/subscriber/*.subscriber.ts'
  ],
  migrations: [
    __dirname + '/src/migration/*.migration.ts'
  ],
  cli: {
    entitiesDir: __dirname + '/entity',
    migrationsDir: __dirname + '/migration',
    subscribersDir: __dirname + '/subscriber'
  }
}

