var mongoose = require ('mongoose');

var Schema = mongoose.Schema;
var Wine = new Schema({
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

Wine.index({_id:1}, {unique:true});

var model = mongoose.model('wine', Wine);

module.export = model;
