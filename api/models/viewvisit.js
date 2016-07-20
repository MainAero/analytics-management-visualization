var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var viewVisitSchema;
viewVisitSchema = new Schema({
    _id: {
        view_id: {type: Schema.Types.ObjectId},
        target_id:{type:String}
    },
    value:{
        "visitIntervals":[
            {
                date_entered: {type: Date},
                date_lastseen: {type: Date}
            }
        ]
    }
    },{collection: 'viewVisits'
});

module.exports = mongoose.model('Viewvisit', viewVisitSchema);

