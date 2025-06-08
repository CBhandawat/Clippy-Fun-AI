/* eslint-disable no-var */
var browser = (function createBrowser() {
    if (typeof chrome !== 'undefined') return chrome
    if (typeof browser !== 'undefined') return browser
    if (typeof global !== 'undefined' && typeof global.browser !== 'undefined') return global.browser
    throw new Error('No browser found')
})()
/* eslint-enable no-var */

const clippyController = {
    agent: null,
    lastComment: null,
    animations: ['Congratulate', 'LookRight', 'SendMail', 'Thinking', 'Explain', 'IdleRopePile', 'IdleAtom', 'Print', 'GetAttention', 'Save', 'GetTechy', 'GestureUp', 'Idle1_1', 'Processing', 'Alert', 'LookUpRight', 'IdleSideToSide', 'LookLeft', 'IdleHeadScratch', 'LookUpLeft', 'CheckingSomething', 'Hearing_1', 'GetWizardy', 'IdleFingerTap', 'GestureLeft', 'Wave', 'GestureRight', 'Writing', 'IdleSnooze', 'LookDownRight', 'GetArtsy', 'LookDown', 'Searching', 'EmptyTrash', 'LookUp', 'GestureDown', 'RestPose', 'IdleEyeBrowRaise', 'LookDownLeft'],
    comments: {},

    init(agent) {
        this.agent = agent
        this.fetchCommentUpdates()

        browser.runtime.sendMessage({ name: 'isActive' }, (response) => {
            if (response.value) {
                clippyController.toggle(response.value)
                clippyController.idle()
            }
        })
    },

    async getAIComment(prompt) {
        try {
            const response = await fetch('http://localhost:3000/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })
            const data = await response.json()
            return data.response
        } catch (err) {
            console.error('LLM error:', err)
            return null
        }
    },

    async talk() {
        const hostname = window.location.hostname
        const prompt = `You are Clippy, fun and helpful. The user is currently browsing: ${hostname}. Generate a witty, quirky, short, or fun comeback suitable for this site.`

        const aiComment = await this.getAIComment(prompt)

        if (aiComment && aiComment !== this.lastComment) {
            this.agent.speak(aiComment)
            this.lastComment = aiComment
        } else {
            this.agent.stop()
            this.lastComment = null
        }
    },

    toggle(state) {
        const clippyBalloon = document.getElementsByClassName('clippy-balloon')

        if (clippyBalloon.length > 0) {
            clippyBalloon[0].style.display = state && clippyBalloon[0].innerText.length > 0 ? 'block' : 'none'
        }

        this.agent.stop()

        if (!state) {
            this.agent.play('GoodBye', 5000, () => {
                clippyController.agent.hide(true)
            })
        } else {
            clippyController.agent.show(true)
        }
    },

    fetchCommentUpdates() {
        browser.runtime.sendMessage({ name: 'comments' })
    },

    idle() {
        browser.runtime.sendMessage({ name: 'idle' })
    },

    animate(callback) {
        this.agent.play(
            this.animations[Math.floor(Math.random() * this.animations.length)],
            5000,
            callback
        )
    }
}

window.addEventListener('load', () => {
    clippy.load('Clippy', (agent) => {
        clippyController.init(agent)

    })
}, false)

browser.runtime.onMessage.addListener((request) => {
    switch (request.name) {
        case 'isActive':
            clippyController.toggle(request.value)
            if (request.value) clippyController.idle()
            break
        case 'comments':
            clippyController.comments = request.value
            break
        case 'animate':
            if (!clippyController.agent) return

            clippyController.fetchCommentUpdates()

            browser.runtime.sendMessage({ name: 'isActive' }, async (response) => {
                if (response.value) {
                    clippyController.agent.stop()
                    await clippyController.talk()
                    clippyController.animate(() => {
                        clippyController.idle()
                    })
                }
            })
            break
        default:
            break
    }
})

const isFirefox = typeof InstallTrigger !== 'undefined'

if (isFirefox) {
    window.addEventListener('message', (event) => {
        const request = event.data || {}
        const manifest = browser.runtime.getManifest()

        browser.runtime.sendMessage({ name: 'isActive' }, (response) => {
            switch (request.name) {
                case 'WHAT_IS_THE_MEANING_OF_LIFE':
                    window.postMessage({
                        name: 'SILENCE_MY_BROTHER',
                        value: {
                            installed: true,
                            isActive: response.value,
                            version: manifest.version
                        }
                    })
                    break
                case 'RISE':
                    browser.runtime.sendMessage({ name: 'toggle' }, (toggleResponse) => {
                        window.postMessage(toggleResponse)
                    })
                    break
                default:
                    break
            }
        })

        return true
    }, false)
}

if (typeof global !== 'undefined') {
    global.clippyController = clippyController
}
