const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema({
    name: {type: String, default: ''},
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    creatAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
  });

module.exports = mongoose.model('Item', Item);
