const fs = require('fs');
const csv = require('csv-parser')

module.exports = class CsvParser {

  parseCsvFile(input) {
    const csvPromise = new Promise((resolve, reject) => {
      let results = []
      fs.createReadStream(input)
        //these header are hardcoded because the file doesn't have them defined
        .pipe(csv(['id', '2', 'type', '4', 'name', '6', '7', '8', '9', 'date', '11', '12', '13', '14']))
          .on('data', (data) => {
              results.push(data)
          })
          .on('end', () => {
              console.log('end')
              resolve({ data: results})
          })
          .on('error', (e) => {
            console.log('error')
            reject(e)
          })
    })
    return csvPromise

  }

  saveToJsonFile(jsonData, fileName) {
    let writer = fs.createWriteStream(fileName);
    writer.write(JSON.stringify(jsonData, null, 4));
  }

}