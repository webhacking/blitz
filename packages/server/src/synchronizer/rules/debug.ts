import {Rule} from './types'
import {fileTransformStream} from './pipeline'

const debugRule: Rule = stream =>
  stream.pipe(
    fileTransformStream((file: any) => {
      console.log('>> ' + file.path, '\n----\n' + file.contents.toString())
      return file
    }),
  )

export default debugRule
