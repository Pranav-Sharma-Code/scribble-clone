export default class HintManager {

    // ---------- GET VALID INDEXES ----------

    static getAvailableIndexes(actualWord, revealedIndexes = []) {
        const availableIndexes = [];
        for (let i = 0; i < actualWord.length; i++) {
            const char = actualWord[i];
            if ( char !== " " && char !== "+" && !revealedIndexes.includes(i)) {
                availableIndexes.push(i);
            }
        }

        return availableIndexes;
    }

    // ---------- PICK RANDOM INDEX ----------

    static getRandomIndex(actualWord, revealedIndexes = []) {
        const availableIndexes = this.getAvailableIndexes(actualWord, revealedIndexes);
        if (availableIndexes.length === 0) {
            return null;
        }
        return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    }

    // ---------- REVEAL LETTER ----------

    static revealLetter(actualWord, displayWord,revealedIndexes = []) {
        const index = this.getRandomIndex(actualWord, revealedIndexes);
        if (index === null) {
            return {displayWord, revealedIndexes, revealedIndex: null};
        }

        const displayArray = displayWord.split("");

        displayArray[index] = actualWord[index];

        return {
            displayWord: displayArray.join(""),

            revealedIndexes: [...revealedIndexes,index],
            revealedIndex: index
        };
    }

    // ---------- CAN REVEAL ? ----------

    static canReveal(revealedIndexes, maxHints = 2) {
        return (revealedIndexes.length < maxHints);
    }

}