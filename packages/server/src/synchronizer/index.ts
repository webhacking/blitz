// import {FSWatcher} from 'chokidar'
import fg from 'fast-glob'
import gulpIf from 'gulp-if'
import {pipeline} from 'readable-stream'
import File from 'vinyl'
import {dest} from 'vinyl-fs'
// import {createManifestFile, Manifest, setManifestEntry} from './manifest'
import {Manifest} from './manifest'
import initializeRules from './rules'
import {unlink} from './unlink'
// import {clean} from './clean'
import {createFileQueue} from './file-queue'
import {rejects} from 'assert'
// import {watch} from './watch'

type SynchronizeFilesInput = {
  src: string
  dest: string
  watch: boolean
  manifestPath: string
  ignoredPaths: string[]
  includePaths: string[]
  writeManifestFile: boolean
}

type SynchronizeFilesOutput = {
  manifest: Manifest
}

export function synchronizeFiles({
  dest: destPath,
  src: srcPath,
  includePaths,
  ignoredPaths,
}: // manifestPath,
// writeManifestFile,
// ...opts
SynchronizeFilesInput): Promise<SynchronizeFilesOutput> {
  return new Promise(() => {
    console.log('START')
    // const manifest = Manifest.create()

    // Cannot use stream mode because we need entryPaths in rules
    const entries = fg.sync(includePaths, {ignore: ignoredPaths, cwd: srcPath, stats: true})
    const entryPaths = entries.map(e => e.path)
    const queue = createFileQueue(srcPath)
    // entries.forEach((entry, index) => {
    //   console.log(index, entry.path)
    // })
    const errorHandler = (err: any) => {
      if (err) {
        rejects(err)
      }
    }

    const rules = initializeRules({
      srcPath,
      destPath,
      entries: entryPaths,
      errorHandler,
    })(queue.in)

    // Consume entries
    for (let entry of entries) {
      queue.in.write(entry)
    }
    // rules.pause()
    // Then start up watcher listen for subsequent file events
    // if (opts.watch) {
    //   watch(includePaths, {
    //     ignored: ignoredPaths,
    //     persistent: true,
    //     ignoreInitial: true,
    //     cwd: srcPath,
    //   }).pipe(queue.in)
    // }

    // clean for now
    // TODO: Work out how to remove this
    // clean(destPath)
    //   .then(() => {
    console.log('about to pipeilne')
    pipeline(
      // Run compilation rules
      rules,

      // File sync
      gulpIf(isUnlinkFile, unlink(destPath), dest(destPath)),

      // This tracks to see if we are ready
      // queue.onReady(() => {
      //   console.log('READY!!!')
      //   resolve({manifest})
      // }),

      // Maintain build manifest
      // TODO: pass through fileEvent so we can push the trackDone to the end
      // setManifestEntry(manifest),
      // createManifestFile(manifest, manifestPath),
      // gulpIf(writeManifestFile, dest(srcPath)),

      // error handler needs to be here too
      errorHandler,
    )
    // })
    // .catch(err => {
    //   console.log('ERRROOOOOOORR')
    //   console.log(err)
    // })
  })
}
const isUnlinkFile = (file: File) => {
  return file.event === 'unlink' || file.event === 'unlinkDir'
}
