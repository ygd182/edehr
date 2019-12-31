'use strict'


const csvParser  = require('./csvParser')
const parser = new csvParser();

parser.parseCsvFile('drug.txt').then(result => parser.saveToJsonFile(result,'drug.json'), error => console.log(error))

