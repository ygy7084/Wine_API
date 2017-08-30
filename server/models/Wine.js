import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Wine = new Schema({
    code : {type : String, unique : true},
    eng_fullname : {type : String},
    eng_shortname : {type : String},
    kor_fullname : {type : String},
    kor_shortname : {type : String},
    category : {type : String},
    country : {type : String},
    region : {type : String},
    subregion : {type : String},
    desc : {type : String},
    photo_url : {type : String},
    grape_race : [{name : String}]
});

const model = mongoose.model('Wine', Wine);

export default model;
