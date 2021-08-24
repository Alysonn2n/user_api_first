const mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost/noderest',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).catch(err => console.log('erro', err));

mongoose.Promise = global.Promise;

module.exports = mongoose;