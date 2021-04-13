const IPFS = require('ipfs');
const libp2p = require('./p2p');
const defaultConf = require('../settings')
const log = require('logplease').create('IPFS')

export default async (repo) => {
    const CONF = Object.assign({libp2p}, {repo}, defaultConf());
    const isInstance = await IPFS.create(CONF)
    log.info(`Started ${isInstance.started}`)
    log.info('Running ipfs id', isInstance.id())
    return isInstance
}
