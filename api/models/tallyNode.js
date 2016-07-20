var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

tallyNodeSchema = new Schema({
    _id: Schema.ObjectId,
    name: String,
    description: String,
    tallyNodeId: String,
    sdCardNumber: Number,
    portNumber:String,
    macAddress_eth: String,
    macAddress_wlan: String,
    ip: String,
    zone: {type: Schema.ObjectId, ref: "Zone"}
},{collection: 'tallyNode'
});

module.exports = mongoose.model('tallyNode', tallyNodeSchema);



