function sudoku(puzzle) {
    const allBoxes = new Array(9).fill(0);
    const getRowIds = (currentBoxId) => {
        if (currentBoxId <= 2) return [0, 1, 2];
        if (2 < currentBoxId <= 5) return [3, 4, 5];
        return [6, 7, 8];
    };
    const getColumnIds = (currentBoxId) => {
        const idModulo = currentBoxId % 3;
        if (idModulo % 3 === 0) return [0, 1, 2];
        if (idModulo % 3 === 1) return [3, 4, 5];
        return [6, 7, 8];
    };
    // on fait un essai aléatoire
    const puzzleTry = JSON.parse(JSON.stringify(puzzle));
    allBoxes.forEach((box, boxId) => {
        const leftNumber = [1,2,3,4,5,6,7,8,9];
        const rowIds = getRowIds(boxId);
        const columnIds = getColumnIds(boxId);
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
        })
        return count;
    };
    let rowDouble = new Array(9).fill(0);
    rowDouble = rowDouble.map((x, i) => getNumberOfDouble(puzzleTry[i]));
    let colDouble = new Array(9).fill(0);
    const rowIt = new Array(9).fill(0);
    const colIt = new Array(9).fill(0);
    colDouble = colIt.map((y, j) => {
        const colInRow = rowIt.map((x, i) => puzzleTry[i][j]);
        return getNumberOfDouble(colInRow);
    });
    return { rowDouble, colDouble };
    // return puzzleTry;
}


module.exports = sudoku;