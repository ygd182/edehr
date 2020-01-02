'use strict'


const csvParser  = require('./csvParser')
const parser = new csvParser();
const filePath = __dirname + "/../tools/drug-test.txt";

parser.parseCsvFile(filePath).then(result => parser.saveToJsonFile(result,'drug.json'), error => console.log(error))

