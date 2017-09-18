import chai from 'chai';
import chaiHttp from 'chai-http';
import configure from '../../server/configure';
import {
  Wine,
} from '../../server/models';

const should = chai.should();
const server = `http://localhost:${configure.PORT}`;

chai.use(chaiHttp);

export default function(){
  let tempId;
  it('should save a wine', (done) => {
   chai.request(server)
     .post(`/api/wine`)
     .send({
       data:{
        category  : 'red',
        country : 'japan',
        region : 'suwon'
       },
     })
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('object');
       res.body.data.should.have.property('category').eql('red');
       res.body.data.should.have.property('country').eql('japan');
       res.body.data.should.have.property('region').eql('suwon');
       //tempId = res.body.data._id;
       done();
     });
 });
 it('should return a wine and numOfwines', (done) => {
   chai.request(server)
     .get(`/api/wine/list/1/0`)
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('array');
       res.body.data[0].should.have.property('category');
       res.body.data[0].should.have.property('country');
       res.body.data[0].should.have.property('region');
       res.body.size.should.eql(6);
       tempId = res.body.data[0]._id;
       console.log(tempId);
       done();
     });
 });

 it('should modify the wine identified by _id',(done) =>{
   chai.request(server)
    .put('/api/wine')
    .send({
      data: {
        _id :  tempId,
        category : 'white',
        region : 'seoul',
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
 it('should remove a wine', (done) =>{
   chai.request(server)
    .delete('/api/wine')
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
        .get(`/api/wine/list/${tempId}`)
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
