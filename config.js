'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/nodeCapstone2";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-nodeCapstone2';
exports.PORT = process.env.PORT || 4050;
