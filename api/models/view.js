var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

viewSchema = new Schema({
    //_id: {type: Schema.ObjectId},
    name: String,
    description: String,
    icon_URL: String,
    zone_arr: [
        {type: Schema.ObjectId, ref: "Zone"}
    ],
    parents_arr: [
        {type: Schema.ObjectId, ref: "View"}
    ],
    children_arr: [
        {type: Schema.ObjectId, ref: "View"}
    ],
    attributes_arr: [
        {type: Schema.ObjectId, ref: "Attribute"}
    ],
    aggregate: Boolean,
    data_type: String,
    status: String,
    venue: {type: Schema.ObjectId, ref: "Venue"}
}, {collection: 'view'
});

module.exports = mongoose.model('View', viewSchema);



