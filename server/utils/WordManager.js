import words from "../data/Words.js";

class WordManager {

    // ---------- RANDOM WORDS ----------

    static getRandomWords(count = 3, category = "all") {
        let wordPool = [];
        if (category !== "all" && words[category]) {
            wordPool = [...words[category]];
        }
        else {
            wordPool = Object.values(words).flat();
        }
        const selectedWords = [];
        while (selectedWords.length < count && selectedWords.length < wordPool.length) {
            const word = wordPool[Math.floor(Math.random() * wordPool.length)];
            if (!selectedWords.includes(word)) {
                selectedWords.push(word);
            }
        }
        return selectedWords;
    }

    // ---------- COMBINATION WORD ----------

    static getCombinationWord(category = "all") {
        const wordsList = this.getRandomWords(2, category);
        return `${wordsList[0]} + ${wordsList[1]}`;
    }

    // ---------- WORD DISPLAY ----------

    static createDisplayWord(word) {
        return word.split("").map(char => {
            if (char === " ") return " ";
            if (char === "+") return "+";
            return "_";
        })
            .join("");
    }

    // ---------- REVEAL LETTER ----------

    static revealLetter(actualWord, currentDisplay, revealedIndexes = []) {
        const availableIndexes = [];
        for (let i = 0; i < actualWord.length; i++) {
            const char = actualWord[i];
            if (char !== " " && char !== "+" && !revealedIndexes.includes(i)) {
                availableIndexes.push(i);
            }
        }
        if (availableIndexes.length === 0) {
            return {
                displayWord: currentDisplay,
                revealedIndexes
            };
        }

        const randomIndex = availableIndexes[
            Math.floor(Math.random() * availableIndexes.length)];

        const displayArray = currentDisplay.split("");
        displayArray[randomIndex] = actualWord[randomIndex];

        return {
            displayWord: displayArray.join(""),
            revealedIndexes: [...revealedIndexes, randomIndex]
        };
    }

    // ---------- NORMALIZE ----------

    static normalizeWord(word) {
        return word.toLowerCase().replaceAll(" ", "").trim();
    }
}

export default WordManager;