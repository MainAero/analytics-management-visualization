var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var venueSchema  = new Schema({
    //_id: Schema.ObjectId, removed _id to be able to get the _id right after saving a new object to mongodb
    name: String,
    description: String,
    address: {
        street: String,
        zip: Number,
        city: String,
        country: String
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    icon_URL: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    // Not sure we need it, each zone knows to which Venue it belongs
    // zones: [{ type : Schema.ObjectId, ref : 'Zone' }] not sure we need it, each zone knows to which Venue it belongs
},{collection: 'venue'
});

module.exports = mongoose.model('Venue', venueSchema);



