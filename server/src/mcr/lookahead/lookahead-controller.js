import {ok, fail} from '../common/utils'
import { Router } from 'express'
import { fs } from 'fs'
import https from 'https'
const csv = require('csv-parser')

const debug = require('debug')('server')
function debugvc (msg) {
  debug('LookaheadController: ' + msg)
}

export default class LookaheadController {
  constructor () {
  }

  parse(query) {
    const csvPromise = new Promise((resolve, reject) => {

        https.get('https://edehr.org/assets/static-databases/drug.txt', function (res) {
          let results = [];
          res.pipe(csv({ headers: false}))
            .on('data', (data) => {
              if(data['2'].toLowerCase() === 'human' && data['4'].toLowerCase().indexOf(query.toLowerCase()) !== -1)
                results.push(data['4'])
            })
            .on('end', () => {
               resolve(results)
            })
            .on('error', (e) => {
              reject(500)
            })
        })
      
    })
    return csvPromise
  }

    
  /**
   * 
   * @param value
   * @return [string]
   */
  filter(data, value) {
    return data.filter((elem) => elem.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  route () {

    const router = new Router()

    router.get('/:query', (req, res) => {
      this
        .parse(req.params.query)
        .then(ok(res))
        .then(null, fail(res))
    })

    return router
  }
}
