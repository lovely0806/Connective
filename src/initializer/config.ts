const config:any = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "connective_schema",
    "synchronize": true,
    "logging": false,
    "entities"   : [
       "dist/entity/**/*.js"
    ],
    "migrations" : [
       "dist/migration/**/*.js"
    ],
    "subscribers": [
       "dist/subscriber/**/*.js"
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
 }

export default config