const Emitter = require('events').EventEmitter

const debug = require('debug')('lp:output')

const Color = require('./Color')
const generateBlankSquare = require('./generateBlankSquare')

class OutputHandler extends Emitter {
    constructor (output) {
        super()

        this._output = output

        this._squares = generateBlankSquare()
        this._inputX = [new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0)]
        this._inputY = [new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0), new Color(0, 0)]

        this.updateBoard(this._squares, this._inputX, this._inputY, false)
    }

    clearSquares() {
        this.updateBoard(generateBlankSquare())
    }

    getSquare(x, y) {
        return this._squares[x][y]
    }

    setSquare (x, y, color) {
        this._squares[x][y] = color
        this._send(144, this._getSquareCoordinate(x, y), color.getCode())

        return this
    }

    getFunctionX(x) {
        return this._inputX[x]
    }

    setFunctionX(x, color) {
        this._inputX[x] = color
        this._send(176, this._getFunctionXCoordinate(x), color.getCode())

        return this
    }

    getFunctionY(y) {
        return this._inputY[y]
    }

    setFunctionY(y, color) {
        this._inputY[y] = color
        this._send(144, this._getFunctionYCoordinate(y), color.getCode())

        return this
    }

    _send (order, note, velocity) {
        debug('sending', [order, note, velocity])
        this._output.send([order, note, velocity])
    }

    updateBoard (squares, inputX = null, inputY = null, diffUpdate = true) {
        for (let x = 0; x < squares.length; x++) {
            for (let y = 0; y < squares[x].length; y++) {
                var color = squares[x][y]

                if (!diffUpdate || this._squares[x][y].getCode() !== color.getCode()) {
                    this.setSquare(x, y, color)
                }
            }
        }

        this._squares = squares;

        if (inputX) {
            for (let x = 0; x < inputX.length; x++) {
                if (!diffUpdate || this._inputX[x].getCode() !== inputX[x].getCode()) {
                    this.setFunctionX(x, inputX[x])
                }
            }

            this._inputX = inputX
        }

        if (inputY) {
            for (let y = 0; y < inputY.length; y++) {
                if (!diffUpdate || this._inputY[y].getCode() !== inputY[y].getCode()) {
                    this.setFunctionY(y, inputY[y])
                }
            }

            this._inputY = inputY
        }
    }

    _getFunctionXCoordinate (x) {
        return x + 104;
    }

    _getFunctionYCoordinate (y) {
        return this._getSquareCoordinate(8, y)
    }

    _getSquareCoordinate (x, y) {
        return (((y - 7) * -1) * 16) + x
    }
}

module.exports = OutputHandler