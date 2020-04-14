// import File from 'vinyl'
import chokidar from 'chokidar'
import {Readable} from 'readable-stream'
// import vinyl from 'vinyl-file'
import {Stats} from 'fs'
import {normalize, resolve} from 'path'
import pathIsAbsolute from 'path-is-absolute'

export function resolveFilepath(filepath: string, cwd?: string) {
  if (pathIsAbsolute(filepath)) {
    return normalize(filepath)
  }
  return resolve(cwd || process.cwd(), filepath)
}

export const watch = (includePaths: string[] | string, options: chokidar.WatchOptions) => {
  const stream = new Readable({
    objectMode: true,
    read() {},
  })

  function processEvent(event: string) {
    return async (path: string, stat: Stats) => {
      stream.push({path, stat, event})
    }
  }

  const watcher = chokidar.watch(includePaths, options)
  watcher.on('add', processEvent('add'))
  watcher.on('change', processEvent('change'))
  watcher.on('unlink', processEvent('unlink'))

  return stream
}
