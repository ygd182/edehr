import { adminToken } from './admin-controller'
import Config from '../../config/config'
import EhrApp from '../../server/app'
import Helper from '../common/test-helper'

// const request = require('supertest')
const BASE = '/admin'
const config = new Config('test')
const configuration = config.config
const ehrApp = new EhrApp()
const helper = new Helper()
const mongoose = require('mongoose')
const should = require('should')
const TYPE = 'Admin'



describe(`Make server calls on ${TYPE}`, function () {
  let theApp
  before(function (done) {
    ehrApp
      .setup(configuration)
      .then(() => {
        theApp = ehrApp.application
      })
      .then(() => {
        return helper.before(done, mongoose)
      })
  })

  it('Admin routing calls', () => {
    let url = BASE + '/'
    return Helper.getUrlAuth(theApp, url, adminToken)
      .expect(200)
      .expect(function (res) {
        should.exist(res)
        res.text.should.equal('hello admin')
        // Helper.consoleRes(res)
      })
  })

  it.skip('Admin reset', function (done) {
    let url = BASE + '/reset'
    Helper.getUrl(theApp, url)
      .expect(200)
      .expect( (res) => {
        should.exist(res)
      })
      .catch ( (error) => {
        should.not.exist(error)
      })
  })

})
