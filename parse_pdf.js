const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('attached_assets/REGIONAL_CONSORTIUM_CHARTER-draft_(LORNA_COMMENTS)_1776246010694.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('parsed_pdf.txt', data.text);
    console.log("PDF parsed successfully.");
});
