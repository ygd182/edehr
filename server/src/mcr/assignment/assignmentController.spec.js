var should = require('should')
const mongoose = require('mongoose')
import AssignmentController from './assignment-controller'
import Helper from '../common/test-helper'
import Config from '../../config/config'
const config = new Config('test')
const configuration = config.config
const helper = new Helper()

const typeName = 'AssignmentController'
const modelName = 'Assignment'

function makeAssignmentController () {
  return new AssignmentController(configuration)
}

/* global describe it */
describe(`${typeName} controller testing`, function () {
  before(function (done) {
    helper.before(done, mongoose)
  })

  it(`${typeName} be valid with model and key`, function (done) {
    let m = makeAssignmentController()
    m.should.have.property('locateAssignmentForStudent')
    done()
  })

  let key = '1'
  let toolConsumerId

  it(`${typeName} create model`, function (done) {
    let m = makeAssignmentController()
    let data = Helper.sampleAssignmentSpec(undefined, key)
    toolConsumerId = data.toolConsumer
    m.create(data)
      .then(doc => {
        should.exist(doc)
        // doc.seedData.should.have.property('foo');
        done()
      })
      .catch(err => {
        console.log(`${typeName} create ${modelName} error ${err}`)
        done()
      })
  })

  it(`${typeName} use locateAssignmentForStudent`, function (done) {
    let m = makeAssignmentController()
    m.locateAssignmentForStudent(key, toolConsumerId)
      .then(doc => {
        // console.log('results', doc)
        should.exist(doc)
        // doc.seedData.should.have.property('foo')
        done()
      })
      .catch(e => {
        console.log('find one error', e)
      })
  })

})
