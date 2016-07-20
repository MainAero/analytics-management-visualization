var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

attributeSchema = new Schema({
    //_id: {type: Schema.ObjectId},
    name: String,
    value: String

}, {collection: 'attribute'
});

module.exports = mongoose.model('Atrribute', attributeSchema);



