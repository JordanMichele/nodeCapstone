'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://jordan:password123@ds231991.mlab.com:31991/brewerybrainiac";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-nodeCapstone2';
exports.PORT = process.env.PORT || 4050;
// mongodb://jordan:password123@ds231991.mlab.com:31991/brewerybrainiac
// mongodb://localhost/nodeCapstone2
