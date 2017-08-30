import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const SeatsSerial = new Schema({
    date : Date,
    seats : [
        {
            _id:false,
            serialNum:Number,
            col:String,
            num:String,
        }
    ]
});

SeatsSerial.index({date:1}, {unique:true});

const model = mongoose.model('SeatsSerial', SeatsSerial);

export default model;