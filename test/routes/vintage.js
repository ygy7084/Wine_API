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
         id_wine : "59b6d132657ab308f0d11e78",
         vintage : 789,
         price_wholesale : 2000
       },
     })
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('object');
       res.body.data.should.have.property('price_wholesale').eql(2000);
       res.body.data.should.have.property('vintage').eql(789);
       tempId = res.body.data._id;
       done();
     });
 });
 it('should return a vintage(num, page) and numOfvintages', (done) => {
   chai.request(server)
     .get(`/api/vintage/list/1/0`)
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('array');
       res.body.data[0].should.have.property('price_wholesale').eql(2000);
       res.body.data[0].should.have.property('vintage').eql(789);
       res.body.data[0].should.have.property('id_wine').eql('59b6d132657ab308f0d11e78');
       res.body.size.should.eql(1);
       done();
     });
 });
 it('should modify the vintage of a vintage identified by _id',(done) =>{
   chai.request(server)
    .put('/api/vintage')
    .send({
      data: {
        _id :  tempId,
        price_wholesale : 1000,
      },
    })
    .end((err,res) => {
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('n').eql(1);
      done();
    });
 });
 it('should remove a vintage', (done) =>{
   chai.request(server)
    .delete('/api/vintage')
    .send({
      data : {
        _id : tempId,
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
 });
}
