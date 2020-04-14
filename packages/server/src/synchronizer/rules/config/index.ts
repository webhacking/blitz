import File from 'vinyl'
import {resolve} from 'path'
import {Rule} from '../types'
import {fileTransformStream} from '../pipeline'

type Args = {
  srcPath: string
  entries: string[]
}

function createStubNextConfig(path: string) {
  return new File({
    path: resolve(path, 'next.config.js'),
    contents: Buffer.from(`module.exports = {}`),
  })
}

function createBlitzConfigLoader() {
  const blitzConfigLoader = `
const {withBlitz} = require('@blitzjs/server');
const config = require('./blitz.config.js');
module.exports = withBlitz(config);  
`
  return new File({
    path: 'next.config.js',
    contents: Buffer.from(blitzConfigLoader),
  })
}

const isConfigFileRx = /(next|blitz)\.config\.js$/

export default function configure({srcPath, entries}: Args): Rule {
  // XXX: invariant - cannot have two config files
  const configNotFound = !entries.find(entry => isConfigFileRx.test(entry))

  return (stream, headStream) => {
    if (configNotFound) {
      headStream.push(createStubNextConfig(srcPath))
    }

    return stream.pipe(
      fileTransformStream(file => {
        const notConfigFile = !isConfigFileRx.test(file.path)

        if (notConfigFile) {
          return file
        }

        file.path = 'blitz.config.js'

        return [file, createBlitzConfigLoader()]
      }),
    )
  }
}
