const XLSX = require('xlsx')

var workbook = XLSX.readFile('data/BPEA_dataviz.xlsx')

workbook.SheetNames.forEach((sheetName) => {

  XLSX.writeFile(workbook, 'data/' + sheetName + '.csv', {
    sheet: sheetName
  })

})
