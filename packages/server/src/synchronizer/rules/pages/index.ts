import File from 'vinyl'
import {absolutePathTransform} from '../utils'
import {Rule} from '../types'
import {fileTransformStream} from '../pipeline'
// import {checkDuplicateRoutes} from './check-duplicate-routes'
// import {checkNestedApi} from './check-nested-api'

export default function configure(opts: {entries: string[]; srcPath?: string}): Rule {
  const filePathTransformer = absolutePathTransform(opts.srcPath)
  const transformer = filePathTransformer(pathTransformer)

  // checkNestedApi(opts.entries)
  // checkDuplicateRoutes(opts.entries)

  return stream =>
    stream.pipe(
      fileTransformStream((file: File) => {
        file.path = transformer(file.path)
        return file
      }),
    )
}

export function pathTransformer(path: string) {
  const regex = new RegExp(`(?:\\/?app\\/.*?\\/?)(pages\\/.+)$`)
  return (regex.exec(path) || [])[1] || path
}
