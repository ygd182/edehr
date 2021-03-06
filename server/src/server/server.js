'use strict'
import Config from '../config/config'
import EhrApp from './app'

const ehrApp = new EhrApp()
const config = new Config(process.env.NODE_ENV)
const configuration = config.config
ehrApp.setup(configuration)
  .then(() => {
    const app = ehrApp.application
    const {serverPort} = configuration
    app.listen(serverPort, () => {
      console.log('Server running...', serverPort)
    })
  })
