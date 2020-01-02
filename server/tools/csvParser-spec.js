const should = require('should')
const request = require('supertest')
const testFilePath = __dirname + "/../tools/drug-test.txt";
import csvParser from './csvParser'

describe('Parse CSV file', function () {
  let parser
  before(function (done) {
    parser = new csvParser();
    done()
  })

  it('Should return a json ouput', function (done) {
    parser.parseCsvFile(testFilePath)
      .then(function (res) {
        should.exist(res)
        res.data[0].should.have.property('name')
        done()
      })
  })

})