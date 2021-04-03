const hls = require('hls.js')
const log = require('electron-log')
const conf = require('./settings/hls')
const EventEmitter = require('events')

module.exports = class HLSStreamer extends EventEmitter {

    constructor(props) {
        super(props);
        this.mime = "application/x-mpegURL"
        this.hls = null;

    }

    get [Symbol.toStringTag]() {
        return 'HLSStreaming'
    }

    onError() {
        /***
         * Handle error on HLS streaming
         * @param {object} event
         * @param {object} data
         */
        this.destroy();
        this.emit('error')
    }

    play(uri, {videoRef}) {
        /***
         * Start HLS streaming play
         * @param {object} videoRef
         * @param {function} onReady
         */
            // Check for native play
        const nativePlay = videoRef.canPlayType(
            'application/vnd.apple.mpegurl'
            )

        if (hls.isSupported()) {
            log.warn(`Starting hls: ${uri}`)
            this.hls = new hls(conf)
            // uri = 'http://gateway.anime4all.net/ipfs/QmRLPbxAadtEWLtRVnP92Zh29f34kewEfEJrqx7z5WdnFb/index.m3u8'
            this.hls.loadSource(uri);
            this.hls.attachMedia(videoRef)
            // When media attached then try to play streaming!!
            this.hls.on(hls.Events.ERROR, this.onError.bind(this))
            this.hls.on(hls.Events.MEDIA_ATTACHED, () => {
                log.info('Media attached')
                this.emit('ready', uri, this.mime)
            })

            this.hls.on(hls.Events.MANIFEST_PARSED, (e, n) => {
                log.info('m3u8 manifest loaded')
                this.emitStart(n)
            })

        } else if (nativePlay) {
            this.emit('ready', uri)
        }

        return this
    }

    quality(n) {
        /**
         * Process qualities to player
         * @param {object} n
         * @return {object}
         */
        const q = n.levels.map((l) => l.height)
        return {
            quality: {
                // this ensures Plyr to use Hls to update quality level
                forced: true, default: q[0], options: q,
                onChange: (e) => this.updateQuality(e),
            }
        }
    }

    subs() {
        return {}
    }

    emitStart(n) {
        // Add new qualities to option
        this.emit('start', {
            ...this.quality(n),
            ...this.subs(n)
        })
    }

    updateQuality(newQuality) {
        this.hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                console.log("Found quality match with " + newQuality);
                this.hls.currentLevel = levelIndex;
            }
        });
    }

    stop() {
        this?.hls?.destroy()
    }

}