const secureRandom = require("secure-random");
const openssl = require('openssl-nodejs');
const Digest = require('digest-js');
const Sha256 = require('sha256');
const fs = require('fs');

// 1. Generate entropy
var entropy = secureRandom(16);
const entropyBinary =  Array.from(entropy)
.map(byte => byte.toString(2).padStart(8, "0")) // Convert each byte to binary and pad to 8 bits
.join("");
console.log(entropy);
// 2. Entropy to mnemonic
    // a. Create Checksum
    const size = entropy.length * 8 / 32;
    console.log(size);
    const entropyBuffer = Buffer.from(entropyBinary, "binary");
    const hash = Sha256(entropyBuffer);

    // Convert each byte to binary and pad to 8 bits
    const sha256Binary = Array.from(hash)
    .map(byte => byte.toString(2).padStart(8, "0")) 
    .join("");  

    // Extract the checksum (first `size` bits)
    const checksum = sha256Binary.slice(0, size);
    console.log("checksum:", checksum);  

    // b. Combine
    const checksumCombination = entropyBinary + checksum;
    console.log("checksumcombination", checksumCombination);

    // c. split in to strings of 11 bits
    // Use regular expression to match groups of 11 characters
    const pieces = checksumCombination.match(/.{11}/g);
    console.log("pieces:", pieces);

    // d. Get the wordlist as an array
    const wordlist = fs.readFileSync('/home/wisdom/creating-mnemonic-phrase/wordlist.txt', 'utf-8').split('\n');
    console.log(wordlist);

    // e. Converts group of bits to array of words
    let sentence = [];
    pieces.map(piece => {
        const i = parseInt(piece, 2);
        const word = wordlist[i].trim();
        console.log(`${piece} ${i.toString().padStart(4)} ${word}`);
        return word;
    });
    const mnemonic = sentence.join(" ");
    console.log("mnemonic:", mnemonic);
    
