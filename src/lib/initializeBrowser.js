const LaunchpadBrowser = require('./LaunchpadBrowser');

function initializeBrowser() {
    return new Promise((resolve, reject) => {
        if (!navigator.requestMIDIAccess) {
            return reject(new Error('browser does not support requestMIDIAccess'))
        }

        navigator.requestMIDIAccess().then(midiAccess => {
            try {
                const {input, output} = _getLaunchpadBrowser(midiAccess)
                const launchpad = new LaunchpadBrowser(input, output)

                launchpad.clearAll();

                resolve(launchpad);
            } catch (error) {
                return reject(error)
            }
        }, reject)
    })
}

function _getLaunchpadBrowser(midiAccess) {
    let lpInput = null
    let lpOutput = null

    for (let input of midiAccess.inputs.values()) {
        if (input.name === 'Launchpad Mini') {
            lpInput = input
        }
    }

    for (let output of midiAccess.outputs.values()) {
        if (output.name === 'Launchpad Mini') {
            lpOutput = output
        }
    }

    if (!lpInput || !lpOutput) {
        throw new Error('no launchpad found')
    }

    return {
        input: lpInput,
        output: lpOutput
    }
}

module.exports = initializeBrowser;