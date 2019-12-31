var should = require('should')
var request = require('supertest')
import csvParser from './csvParser'
import Config from '../config/config'

const config = new Config('test')
const configuration = config.config


describe('Parse CSV file', function () {
  let app
  before(function (done) {
  })

  it('return a json ouput', function (done) {
    csvParser
      .end(function (err, res) {
        should.not.exist(err)
        should.exist(res)
         console.log(res)
        done()
      })
  })

})