const IPFS = require('ipfs');
const log = require('logplease').create('IPFS')
const libp2p = require('./p2p')
const defaultConf = require('./settings');


const ipfsFactory = async (conf = {}) => {

    // Ipfs factory
    const confSettings = defaultConf()
    const isInstance = await IPFS.create({
        ...{
            config: confSettings, preload: {enabled: false},
            EXPERIMENTAL: {pubsub: true},
            ...{libp2p},
        }, ...conf
    })

    try {
        await isInstance.start();
        const ipfsID = await isInstance.id()
        isInstance.kill = async () => isInstance.stop(); // Alias to stop
        isInstance.peerId = ipfsID; // Add virtual attr needed for broadcasting

        Promise.all(confSettings.Bootstrap.map(async (p) => {
            log.info('Dialing to ', p)
            return await isInstance.swarm.connect(p)
        })).then(() => log.info('Dial done'))

        setInterval(async () => console.log(await isInstance.swarm.peers()), 3000)
        log.info('Running ipfs id', ipfsID.id)
        return isInstance
    } catch (e) {
        await isInstance.stop().catch(() => log.error('Error trying to stop node'));
        log.error('Fail on start: cleanup node')
        return false;
    }

}

module.exports = {
    start: ipfsFactory
}