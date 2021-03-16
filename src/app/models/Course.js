const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Course = new Schema({
    name: {type: String, default: ''},
    description: { type: String, default: '' },
    videoId: { type: String, default: '' },
    level: { type: String, default: '' },
    image: { type: String, default: '' },
    slug: { type: String, slug: "name", unique: true }
  }, {
    timestamps: true
});

module.exports = mongoose.model('Item', Course);  
