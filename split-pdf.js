var fs = require('fs');
var hummus = require('hummus');
var path = require('path');
const pdf = require('pdf-parse');

const MAX_FILE_SIZE = 5

var outputFolder = path.join(__dirname, '/output');

const directoryPath = path.join(__dirname, 'PDF_Files/');

fs.readdir(directoryPath, (err, files) => {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach((file) => {

    let pageCount = 0
    // Do whatever you want to do with the file
    let dataBuffer = fs.readFileSync('PDF_Files/' + file);
    pdf(dataBuffer).then(function (data) {
      pageCount = data.numpages
      // number of pages
      console.log("Data numpages : ",data.numpages);
    });
    var stats = fs.statSync('PDF_Files/' + file)
    var fileSizeInBytes = stats["size"]
    if (fileSizeInBytes > MAX_FILE_SIZE) {
      var sourcePDF = path.join(directoryPath + file);
      filesCount = Math.ceil(fileSizeInBytes / MAX_FILE_SIZE);
      pagesPerFile = pageCount / filesCount
      console.log(pageCount)
      console.log(filesCount)
      console.log(pagesPerFile)
      // for (let i = 0; i < filesCount; i++) {
      //   var pdfWriter = hummus.createWriter(path.join(outputFolder, ` ${file} (${i}).pdf`));
      //   for (let j = 0; j < pagesPerFile; j++) {
      //     pdfWriter.appendPDFPagesFromPDF(sourcePDF, { type: hummus.eRangeTypeSpecific, specificRanges: [[j, j]] });
      //   }
      //   pdfWriter.end();
      // }
    }
  });
});
