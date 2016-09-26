module.exports = {
  "test": {
    "db": process.env.MONGO_URL || process.env.MONGOLAB_URI || "mongodb://localhost:27017/kimono-test",
  },
  "development": {
    "db": process.env.MONGO_URL || process.env.MONGOLAB_URI || "mongodb://localhost:27017/kimono",
  },
  "qa": {
    "db": process.env.MONGO_URL || process.env.MONGOLAB_URI || "mongodb://localhost:27017/kimono",
    "db_options":{ "server": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS": 30000 } }, "replset": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS" : 30000 } } },
  },
  "stage": {
    "db": process.env.MONGO_URL || process.env.MONGOLAB_URI || "mongodb://localhost:27017/kimono",
    "db_options":{ "server": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS": 30000 } }, "replset": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS" : 30000 } } },
  },
  "production": {
    "db": process.env.MONGO_URL || process.env.MONGOLAB_URI || "mongodb://localhost:27017/kimono",
    "db_options":{ "server": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS": 30000 } }, "replset": { "socketOptions": { "keepAlive": 1, "connectTimeoutMS" : 30000 } } },
  }
};