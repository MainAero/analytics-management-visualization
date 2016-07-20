var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var aggregatedViewVisitDataSchema;
/*aggregatedViewVisitDataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    view_id: {type: Schema.Types.ObjectId},
    // Date dimensions
    year: {type:Date},
    quarter: {type:Date},
    month: {type:Date},
    //week: {type:Date},
    week: {type:String}, //ISO week Date not supported by js. Need to keep it as a String
    day: {type:Date},
    hour: {type:Date},

    // Metrics
    startingVisits:  {type: Number},
    endingVisits:  {type: Number},
    onGoingVisits:  {type: Number},
    dwellTime: {type:Number}

},{collection: 'aggregatedViewVisitData'
});*/


aggregatedViewVisitDataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    view_id: {type: Schema.Types.ObjectId},

    dimension : {type: String}, //This is either 'startingVisits', 'endingVisits', 'ongoingVisits', 'newVisits', 'returningVisits'
    dateDimension: {type: String}, // 'hour', 'day', 'week', 'month','quarter', 'year'

    date : {type: Date}, //Represents the date according to the above dateDimension, e.g. ISODate(2014-01-01T00:00) for 'year'

    metric: {type: String}, // For example: count, dwellTime or visitorFrequency

    value: {type: Schema.Types.Mixed}

   // value: {type: Number}

},{collection: 'aggregatedViewVisitData'
});

module.exports = mongoose.model('AggregatedViewVisitData', aggregatedViewVisitDataSchema);


