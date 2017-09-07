import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Wine = new Schema({
    code : String,
    eng_fullname : String,
    eng_shortname : String,
    kor_fullname : String,
    kor_shortname : String,
    category : String,
    country : String,
    region : String,
    subregion : String,
    desc : String,
    photo_url : String,
    grape_race : [{name : String}]      // array 선언 이게 맞는건지?
});

Wine.index({code:1}, {unique:true});

const model = mongoose.model('wine', Wine);

export default model;
