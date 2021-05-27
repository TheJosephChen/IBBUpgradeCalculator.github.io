let letters = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao"];

function convertNumberLetter(number, letter) {
    var finalNum;
    var finalLet;

    if (letter == undefined) {
        letter = "";
    }
    
    // current max supported value
    if (letter == null) {
        return number.toString()
    }

    if (letter == "ao") {
        // make no change
        finalNum = number;
        finalLet = letter;
    } else {
        // adjust to appropriate letter
        var index = letters.indexOf(letter);
        if (index == -1) {
            index = 0;
        }

        while (number > 1000) {
            index++;
            number /= 1000;
        }
        finalNum = parseFloat(number).toFixed(2);
        finalLet = letters[index];
    }
    return  finalNum.toString() + finalLet;
}

function reverseNumberLetter(number, letter) {
    
    if (letter == undefined || letter == "" || letter == null) {
        return number;
    } else {
        var index = letters.indexOf(letter);
        while (index > 0) {
            index--;
            number *= 1000;
        }
        return number;
    }
}