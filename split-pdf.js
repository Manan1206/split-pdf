var fs = require('fs');
var hummus = require('hummus');
var path = require('path');
const pdf = require('pdf-parse');

// Max size of split pdf in bytes
const MAX_FILE_SIZE = 20000000

// Output Folder for split pdfs
var outputFolder = path.join(__dirname, 'PDF_Files');

// Input Directory of pdfs
const directoryPath = path.join(__dirname, 'PDF_Files/');

fs.readdir(directoryPath, (err, files) => {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach((file) => {
    let dataBuffer = fs.readFileSync('PDF_Files/' + file);
    pdf(dataBuffer).then(function (data) {
      this.pageCount = data.numpages
      var stats = fs.statSync('PDF_Files/' + file)
      var fileSizeInBytes = stats["size"]
      if (fileSizeInBytes > MAX_FILE_SIZE) {
        var sourcePDF = path.join(directoryPath + file);
        filesCount = Math.ceil(fileSizeInBytes / MAX_FILE_SIZE);
        pagesPerFile = this.pageCount / filesCount
        fileName = file.replace('.pdf', '')
        for (let i = 0; i < filesCount; i++) {
          var pdfWriter = hummus.createWriter(path.join(outputFolder, ` ${fileName} (${i}).pdf`));
          for (let j = 0; j < pagesPerFile; j++) {
            pdfWriter.appendPDFPagesFromPDF(sourcePDF, { type: hummus.eRangeTypeSpecific, specificRanges: [[j, j]] });
          }
          pdfWriter.end();
        }
      }
    });
  });
});
