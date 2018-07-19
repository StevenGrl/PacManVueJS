document.addEventListener('DOMContentLoaded', () => {
    const grid = new Vue({
        el: '#game',
        data: () => ({
            title: 'Pac Man V_0',
            game: [],
            direction: {
                '37': 'left', // left
                '38': 'up', // up
                '39': 'right', // right
                '40': 'down', // down
            },
            valueDirection: {
                '37': -1, // left
                '38': -21, // up
                '39': 1, // right
                '40': 21, // down
            },
            score: {
                'bigDot': 50,
                'dot': 10,
            },
            timeOut: null,
            winMessage: null,
            previousDirection: null,
        }),
        created: function () {
            this.createGame()
            window.addEventListener('keyup', this.changeDirection);
        },
        methods: {
            createGame() {
                this.game = new GameMap(21, 21)
            },
            changeDirection: function (e) {
                if ((e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) && e.keyCode !== this.previousDirection) {
                    this.move(this.direction[e.keyCode], this.valueDirection[e.keyCode], e.keyCode)
                }
            },
            move(direction, value, keyCode) {
                if ((!this.game.wallCellsId.includes(this.game.pacmanCellId + value)
                     || (this.game.pacmanCellId + value === 189) 
                     || (this.game.pacmanCellId + value === 211)
                    ) && this.winMessage === null) {
                    this.previousDirection = keyCode
                    if (this.timeOut !== null) clearTimeout(this.timeOut)
                    const oldCell = this.getCellById(this.game.pacmanCellId)
                    if (this.game.pacmanCellId + value === 189) {
                        this.game.pacmanCellId = 210
                    } else if ((this.game.pacmanCellId + value === 211)) {
                        this.game.pacmanCellId = 190
                    } else {
                        this.game.pacmanCellId += value
                    }
                    const cell = this.getCellById(this.game.pacmanCellId)
                    if (cell.type === 'dot' || cell.type === 'bigDot') {
                        this.game.nbDot--
                        this.game.score += this.score[cell.type]
                    } 
                    if (cell && oldCell.type === 'pacmanClose') {
                        cell.type = 'pacmanOpen'
                    } else if (cell && oldCell.type === 'pacmanOpen') {
                        cell.type = 'pacmanClose'
                    }
                    if (oldCell) oldCell.type = 'black'
                    if (this.game.nbDot === 0) {
                        this.winMessage = 'Vous avez gagné ! bravo :)'
                        return
                    } 
                    this.game.direction = direction
                    
                    this.timeOut = setTimeout(()=>{
                        this.move(direction, value, keyCode)
                    }, 300)
                }
            },
            getCellById(id) {
                return this.allCells.find(c => c.id === id) || null
            }
        },
        computed: {
            allCells() {
                return [].concat(...this.game.map)
            }
        }
    })
})

class GameMap {
    constructor(nbRow, nbCol) {
        this.map = []
        this.wallCellsId = []
        let wallIds = [
            2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, // Line 1
            23, 32, 41, // Line 2
            44, 46, 47, 49, 50, 51, 53, 55, 56, 57, 59, 60, 62, // Line 3
            65, 83, //Line 4
            86, 88, 89, 91, 93, 94, 95, 96, 97, 99, 101, 102, 104, // Line 5
            107, 112, 116, 120, 125, // Line 6
            128, 129, 130, 131, 133, 134, 135, 137, 139, 140, 141, 143, 144, 145, 146, // Line 7
            152, 154, 162, 164, // Line 8
            169, 170, 171, 172, 173, 175, 177, 178, 180, 181, 183, 185, 186, 187, 188, 189, // Line 9
            198, 202, // Line 10
            211, 212, 213, 214, 215, 217, 219, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, // Line 11
            236, 238, 246, 248, // Line 12
            254, 255, 256, 257, 259, 261, 262, 263, 264, 265, 267, 269, 270, 271, 272, // Line 13
            275, 284, 293, // Line 14
            296, 298, 299, 301, 302, 303, 305, 307, 308, 309, 311, 312, 314, // Line 15
            317, 320, 332, 335, // Line 16
            338, 339, 341, 343, 345, 346, 347, 348, 349, 351, 353, 355, 356, // Line 17
            359, 364, 368, 372, 377, // Line 18
            380, 382, 383, 384, 385, 386, 387, 389, 391, 392, 393, 394, 395, 396, 398, // Line 19
            401, 419, // Line 20
            422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, // Line 21
        ]
        let dotCellsId = [
            24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, // Line 2
            48, 52, 54, 58, // Line 3
            66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, // Line 4
            87, 90, 92, 98, 100, 103,// Line 5
            108, 109, 110, 111, 113, 114, 115, 117, 118, 119, 121, 122, 123, 124, // Line 6
            132, 136, 138, 142, // Line 7
            153, 163, // Line 8
            174, 184, // Line 9
            195, 205, // Line 10
            216, 226, // Line 11
            237, 247, // Line 12
            258, 268, // Line 13
            276, 277, 278, 279, 280, 281, 282, 283, 285, 286, 287, 288, 289, 290, 291, 292, // Line 14
            297, 300, 304, 306, 310, 313, // Line 15
            319, 321, 322, 323, 324, 325, 327, 328, 329, 330, 331, 333, // Line 16
            340, 342, 344, 350, 352, 354, // Line 17
            360, 361, 362, 363, 365, 366, 367, 369, 370, 371, 373, 374, 375, 376, // Line 18
            381, 388, 390, 397, // Line 19
            402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, // Line 20
        ]
        let bigDotCellsId = [
            45, 61, // Line 2
            318, 334, // Line 16
        ]
        this.blinky = 158
        let doorCellId = 179
        let start = 326
        for (let rowIndex = 0; rowIndex < nbRow; rowIndex++) {
            const cells = []
            for (let colIndex = 0; colIndex < nbCol; colIndex++) {
                const cellId = (colIndex + 1) + (rowIndex * nbCol)
                let type = ''

                /* contour */
                if (wallIds.includes(cellId)) {
                    type = 'wall'
                } else if (start === cellId) {
                    type = 'pacmanOpen'
                    this.pacmanCellId = cellId
                } else if (bigDotCellsId.includes(cellId)) {
                    type = 'bigDot'
                } else if (dotCellsId.includes(cellId)) {
                    type = 'dot'
                } else if (doorCellId === cellId) {
                    type = 'door'
                } else if (cellId == this.blinky) {
                    type = 'blinky'
                } else {
                    type = 'black'
                }
                const cell = new GameCell(cellId, type)
                cells.push(cell)
            }
            this.map.push(cells)
        }
        this.score = 0
        this.wallCellsId.push(...wallIds)
        this.direction = 'right'
        this.nbDot = bigDotCellsId.length + dotCellsId.length
    }
}

class GameCell {
    constructor(id, type) {
        this.type = type
        this.id = id
    }
}