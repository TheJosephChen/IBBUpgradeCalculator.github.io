let letters = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "N", "D", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao"];

function convertNumberLetter(number, letter) {
    var finalNum;
    var finalLet;

    // current max supported value
    if (letter == "ao") {
        finalNum = number;
        finalLet = letter;
    } else {
        var index = letters.indexOf(letter);
        while (number > 1000) {
            index++;
            number /= 1000;
        }
        finalNum = number.toFixed(2);
        finalLet = letters[index];
    }
    return  finalNum.toString() + finalLet;

}