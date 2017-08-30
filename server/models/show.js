import mongoose from 'mongoose';

/* Show 스키마
 name    // 공연 이름
 */
const Schema = mongoose.Schema;
const Show = new Schema({
    name : String,
});

Show.index({name:1}, {unique:true});

const model = mongoose.model('show', Show);

export default model;