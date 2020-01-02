const fs = require('fs');
const csv = require('csv-parser')

module.exports = class CsvParser {

  parseCsvFile(input) {
    const csvPromise = new Promise((resolve, reject) => {
      let results = []
      fs.createReadStream(input)
        .pipe(csv())
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