require = require("esm")(module/*, options*/);
console.time('playing-book-services import');
module.exports = require('./src/index').default;
module.exports.DocTypes = require('./src/constants').DocTypes;
module.exports.entities = require('./src/entities').default;
module.exports.models = require('./src/models').default;
console.timeEnd('playing-book-services import');
