import mongoose from 'mongoose';

/* Show 스키마
 show,    // 공연 ID
 theater, // 공연장 ID
 schedule :[{
    date,    // 공연 날짜 및 시각
    url,     // 크롤링 url
    reservations    // 예약 ID
    }]
 */
const Schema = mongoose.Schema;
const Showtime = new Schema({
    theater : {type : Schema.Types.ObjectId, ref:'theater'},
    show : {type : Schema.Types.ObjectId, ref:'show'},
    schedule : [{
        _id:false,
        date : Date,
        url : String,
        reservations:[{_id:{type : Schema.Types.ObjectId, ref:'reservation'}}]
    }]
});

Showtime.index({theater:1, show:1}, {unique:true});

const model = mongoose.model('showtime', Showtime);

export default model;