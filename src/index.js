// Reffer https://github.com/adrienjoly/npm-pdfreader for docs
import {PdfReader} from "pdfreader"
import path from 'path';
import { fileURLToPath } from "url";

/**
 * Compares the pdf and prints based on the given question
 * @param {string} file1Path 
 * @param {string} file2Path 
 */
async function comparePDFs(file1Path, file2Path){
    try {
        const file1Data = await getFileData(file1Path)
        const file2Data = await getFileData(file2Path)
    
        if(file1Data === file2Data){
            console.log("Files are identical")
        }
    
        else {
            console.log("Files are different")
            printDifference(file1Data, file2Data)
        }
    } catch (error) {
        console.log("Error: ",error)
    }

}

/**
 * Parsers the given file and returns the data
 * @param {string} filePath 
 * @returns pdf file data as a string
 */
async function getFileData(filePath){
    const reader = new PdfReader();

    return new Promise((resolve, reject) => {
        let content = ``;
        let currentFileYPos = -10000

        reader.parseFileItems(filePath, (err, item) => {
            if(err) reject(err)

            if(!item){ resolve(content) }

            if(item && item.text){
                if(currentFileYPos === item.y) {
                    content = content + item.text
                }

                if(currentFileYPos !== item.y){
                    currentFileYPos = item.y

                    content = content + `\n ${item.text}`
                }
            }
        })
    })
}

/**
 * Prints the difference in the lines of data1 and data2
 * @param {string} data1 
 * @param {string} data2 
 */
function printDifference(data1, data2) {
    const lines1 = data1.split('\n');
    const lines2 = data2.split('\n');
  
    const maxLength = Math.max(lines1.length, lines2.length);
  
    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
  
      if (line1 !== line2) {
        console.log(`- File 1: ${line1}`);
        console.log(`- File 2: ${line2}`);
        console.log();
      }
    }
  }


/**
 * Function to test output
 * Case 1: when 2 files are different
 * Case 2: when 2 files are similar
 */
async function testOutput() {
    const currentFilePath = fileURLToPath(import.meta.url)
    const filePathForInputPdf = path.resolve(currentFilePath, "../../test-data/")

    const inputFile1 = path.resolve(filePathForInputPdf, "pdf-1.pdf");
    const inputFile2 = path.resolve(filePathForInputPdf, "pdf-2.pdf");
    const inputFile1Copy = path.resolve(filePathForInputPdf, "pdf-1-copy.pdf"); 

    console.log("Case 1: When both the input pdf are not similar \n")
    await comparePDFs(inputFile1, inputFile2);

    console.log("Case 2: When the files are similar \n")
    await comparePDFs(inputFile1, inputFile1Copy)
}

testOutput()