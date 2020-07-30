const path = require('path');
const fs = require('fs');
// const PDFNet = require('@pdftron/pdfnet-node');
// import PDFDocument from 'pdf-lib';
const pdflib = require('pdf-lib')
const PDFDocument = pdflib.PDFDocument
// console.log(PDFDocument)
MAX_FILE_SIZE = 2 // in bytes
//joining path of directory 

filesArray = []

const directoryPath = path.join(__dirname, 'PDF_Files/');
//passsing directoryPath and callback function
fs.readdir(directoryPath, (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach((file) => {
        // Do whatever you want to do with the file
        var stats = fs.statSync('PDF_Files/' + file)
        var fileSizeInBytes = stats["size"]
        if (fileSizeInBytes > MAX_FILE_SIZE) {
            // console.log(file)
            filesArray.push(file)
        }
    });
});


const splitPDF = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    console.log("before reading file")
    const firstDonorPdfBytes = fs.readFile('PDF_Files/test.pdf', (err, data) => {
        if(err) {
            console.log("Error")
            throw err;
        }
    })
    // const secondDonorPdfBytes = filesArray[0]

    // Load a PDFDocument from each of the existing PDFs
    // const existingPdfBytes = await fetch('PDF_files/' + filesArray[0]).then(res => res.arrayBuffer())
    // var bytes = new Uint8Array(existingPdfBytes);
    // const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes)
    // const secondDonorPdfDoc = await PDFDocument.load('PDF_Files/' + secondDonorPdfBytes)

    // Copy the 1st page from the first donor document, and 
    // the 743rd page from the second donor document
    const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [0])
    // const [secondDonorPage] = await pdfDoc.copyPages(secondDonorPdfDoc, [1])

    // Add the first copied page
    pdfDoc.addPage(firstDonorPage)

    // Insert the second copied page to index 0, so it will be the 
    // first page in `pdfDoc`
    // pdfDoc.insertPage(0, secondDonorPage)

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
}

splitPDF()

// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>