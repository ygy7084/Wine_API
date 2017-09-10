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
  it('should save a wine', (done) => {
   chai.request(server)
     .post(`/api/wine`)
     .send({
       data:{
         code : '8901',
         country : 'korea',
       },
     })
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('object');
       res.body.data.should.have.property('code').eql('8901');
       res.body.data.should.have.property('country').eql('korea');
       console.log(res.body.data);
       done();
     });
 });
 it('should return a wine', (done) => {
   chai.request(server)
     .get(`/api/wine/list/2/1`)
     .end((err, res) => {
       should.exist(res.body);
       res.should.have.status(200);
       res.body.should.be.a('object');
       res.body.data.should.be.a('array');
       res.body.data[0].should.have.property('code').eql('3456');
       res.body.data[0].should.have.property('country').eql('korea');
       res.body.data[1].should.have.property('code').eql('4567');
       res.body.data[1].should.have.property('country').eql('korea');
       console.log(res.body.data);
       done();
     });
 });
}
