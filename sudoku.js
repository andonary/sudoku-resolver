function sudoku(puzzle) {
    const allBoxes = new Array(9).fill(0);
    const getRowIds = (currentBoxId) => {
        if (currentBoxId < 3) return [0, 1, 2];
        if (currentBoxId < 6) return [3, 4, 5];
        if (currentBoxId < 9) return [6, 7, 8];
    };
    const getColumnIds = (currentBoxId) => {
        const idModulo = currentBoxId % 3;
        if (idModulo === 0) return [0, 1, 2];
        if (idModulo === 1) return [3, 4, 5];
        if (idModulo === 2) return [6, 7, 8];
    };
    // on fait un essai aléatoire
    const puzzleTry = JSON.parse(JSON.stringify(puzzle));
    const fillBoxRandomly = (boxNumber) => {
        const leftNumber = [1,2,3,4,5,6,7,8,9];
        const rowIds = getRowIds(boxNumber);
        const columnIds = getColumnIds(boxNumber);
        // on filtre les nombres déjà utilisés par la grille d'origine
        for (const rowId of rowIds) {
            for (const columnId of columnIds) {
                const currentNumber = puzzle[rowId][columnId];
                if (currentNumber === 0) continue;
                const nbToLeftId = leftNumber.findIndex(nb => nb === currentNumber);
                leftNumber.splice(nbToLeftId, 1);
            }
        }
        // on remplit aléatoirement la box
        for (const rowId of rowIds) {
            for (const columnId of columnIds) {
                const currentNumber = puzzle[rowId][columnId];
                if (currentNumber !== 0) continue;
                const rdnLeftNumberId = Math.floor(Math.random() * leftNumber.length);
                puzzleTry[rowId][columnId] = leftNumber[rdnLeftNumberId];
                leftNumber.splice(rdnLeftNumberId, 1);
            }
        }
    };
    // on le fait intégralement
    allBoxes.forEach((box, boxId) => {
        fillBoxRandomly(boxId);
    });
    // méthode stochastique, on compte le nombre de doublons de chaque ligne et colonne
    const getNumberOfDouble = (row) => {
        let count = 0;
        const alreadyCount = [];
        row.forEach((nb, rowId) => {
            const isThereOther = row.find((el, id) => el === nb && id !== rowId);
            const notOperated = !alreadyCount.find(el => el === nb);
            if (isThereOther && notOperated) {
                count++;
                alreadyCount.push(nb);
            }
        });
        return count;
    };
    const fillUntilDone = () => {
        let rowDouble = new Array(9).fill(0);
        rowDouble = rowDouble.map((x, i) => getNumberOfDouble(puzzleTry[i]));
        let colDouble = new Array(9).fill(0);
        const rowIt = new Array(9).fill(0);
        const colIt = new Array(9).fill(0);
        colDouble = colIt.map((y, j) => {
            const colInRow = rowIt.map((x, i) => puzzleTry[i][j]);
            return getNumberOfDouble(colInRow);
        });
        // si aucun doublons, on a la solution
        const sumRowDouble = rowDouble.reduce((acc, val) => {
            return acc + val;
        }, 0);
        const sumColDouble = colDouble.reduce((acc, val) => {
            return acc + val;
        }, 0);
        if (sumRowDouble === 0 && sumColDouble === 0) {
            return puzzleTry;
        }
        // on cherche la box qui possède le plus d'erreur
        const allBoxesErrorCount = allBoxes.map((box, _boxId) => {
            const rowIds = getRowIds(_boxId);
            const columnIds = getColumnIds(_boxId);
            let countErrors = 0;
            rowIds.forEach(rowId => {
                countErrors += rowDouble[rowId];
            });
            columnIds.forEach(colId => {
                countErrors += colDouble[colId];
            });
            return countErrors;
        });
        // on corrige les plus grosses erreurs si erreur > 0
        const maxErrorAllBoxes = [...allBoxesErrorCount].sort((a,b) => b - a);
        let nIterable = 0;
        let previousBoxId = -1;
        for (const maxError of maxErrorAllBoxes) {
            if (maxError === 0 || nIterable > 2) continue;
            const boxIdToRedo = allBoxesErrorCount.findIndex(el => el === maxError && el !== previousBoxId);
            if (boxIdToRedo && boxIdToRedo !== previousBoxId) {
                fillBoxRandomly(boxIdToRedo);
            }
            nIterable++;
            previousBoxId = boxIdToRedo;
        };
        return fillUntilDone();
    };
    return fillUntilDone();
}


module.exports = sudoku;
