var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var wifireportSchema = new Schema({
        _id: {type: Schema.ObjectId},
        venue: {type: Schema.ObjectId, ref: "Venue"},
        zone_arr: [
            {type: Schema.ObjectId, ref: "Zone"}
        ],
        master_id: {type: String},
        target_id: {type: String},
        timestamp_start: {type: Number, index:true},
        timestamp_end: {type: Number},
        time_start: {type: Date},
        time_end: {type: Date},
        wlan_seq: {type: Number},
        measurements: [
            {
                node_id: {type: String},
                zone: {type: Schema.ObjectId, ref: "Zone"},
                rssi: {type: Number},
                noise: {type: Number},
                ch_type: {type: String},
                ch_freq: {type: String},
                timestamp: {type: Number},
                time: {type: Date},
                wlan_seq: {type: Number}
            }
        ]
    },
    {collection: 'wifireport'
    });

module.exports = mongoose.model('Wifireport', wifireportSchema);
