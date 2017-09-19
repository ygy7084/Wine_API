import chai from 'chai';
import chaiHttp from 'chai-http';
import configure from '../../server/configure';
import {
  Vintage,
} from '../../server/models';

const should = chai.should();
const server = `http://localhost:${configure.PORT}`;

chai.use(chaiHttp);

export default function(){
  let tempId;
  it('should save a vintage', (done) => {
   chai.request(server)
     .post(`/api/vintage`)
     .send({
       data:{
         vintage : 1234,
         price_wholesale : 1234
       },
     })
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('object');
       res.body.data.should.have.property('vintage').eql(1234);
       res.body.data.should.have.property('price_wholesale').eql(1234);
       //tempId = res.body.data._id;
       done();
     });
 });
 it('should return a vintage and numOfvintages', (done) => {
   chai.request(server)
     .get(`/api/vintage/list/1/2`)
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('array');
       res.body.data[0].should.have.property('vintage');
       res.body.data[0].should.have.property('price_wholesale');
       res.body.size.should.eql(6);
       tempId = res.body.data[0]._id;
       console.log(tempId);
       done();
     });
 });

 it('should modify the vintage identified by _id',(done) =>{
   chai.request(server)
    .put('/api/vintage')
    .send({
      data: {
        _id :  tempId,
        vintage : 2345,
        price_wholesale : 2345,
      },
    })
    .end((err,res) => {
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('success').eql(true);
      done();
    });
 });
 it('should remove a vintage', (done) =>{
   chai.request(server)
    .delete('/api/vintage')
    .send({
      data : {
        _id : tempId
      },
    })
    .end((err, res) => {
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      chai.request(server)
        .get(`/api/vintage/list/${tempId}`)
        .end((err,res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          should.equal(res.body.data,null);
          done();
        });
    });
 })
}
