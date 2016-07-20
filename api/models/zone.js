var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

zoneSchema = new Schema({
    //_id: Schema.ObjectId, removed _id to be able to get the _id right after saving a new object to mongodb
    name: String,
    description: String,
    location: {
        latitude: Number,
        longitude: Number,
        floorNumber: String
    },
    location_description: String,
    icon_URL: String,
    area:Number,//the size of the area covered by this zone, can be by m^2
    // for the Quuppa dataset
    areaName: String,
    geometry: Array,
    venue: {type: Schema.ObjectId, ref: "Venue"}
},{collection: 'zone'
});

module.exports = mongoose.model('Zone', zoneSchema);



