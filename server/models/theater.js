import mongoose from 'mongoose';

/* Reservation 스키마
 name,    // 공연장 이름
 seats_quantity,  // 좌석 수량
 seats            // 좌석
                  //ex)좌석 예제
 seats : [ {floor, col, num, seat_class, x, y}, ...] //x,y는 필요시 화면상의 좌표
 */
const Schema = mongoose.Schema;
const Theater = new Schema({
    name : String,
    seats_quantity : Number,
    seats : [
        {
            _id:false,
            serialNum:Number,
            floor:String,
            col:String,
            num:String,
            seat_class:String,
            x : Number,
            y : Number
        }
    ]
});

Theater.index({name:1}, {unique:true});

const model = mongoose.model('theater', Theater);

export default model;