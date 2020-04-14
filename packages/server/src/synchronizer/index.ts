// import {FSWatcher} from 'chokidar'
import fg from 'fast-glob'
import gulpIf from 'gulp-if'
import {pipeline} from 'readable-stream'
import File from 'vinyl'
import {dest} from 'vinyl-fs'
import {createManifestFile, Manifest, setManifestEntry} from './manifest'
import rulesPipeline from './rules'
import {unlink} from './unlink'
import {clean} from './clean'
import {createFileQueue} from './file-queue'
import {watch} from './watch'

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

const errorHandler = (err: any) => {
  if (err) {
    throw new Error(err)
  }
}

export async function synchronizeFiles({
  dest: destPath,
  src: srcPath,
  includePaths,
  ignoredPaths,
  manifestPath,
  writeManifestFile,
  ...opts
}: SynchronizeFilesInput): Promise<SynchronizeFilesOutput> {
  const manifest = Manifest.create()

  // Cannot use stream mode because we need entryPaths in rules
  const entries = fg.sync(includePaths, {ignore: ignoredPaths, cwd: srcPath, stats: true})
  const entryPaths = entries.map(e => e.path)
  const queue = createFileQueue(srcPath)

  // Consume entries
  for (let entry of entries) {
    queue.in.write(entry)
  }

  // Then start up watcher listen for subsequent file events
  if (opts.watch) {
    watch(includePaths, {
      ignored: ignoredPaths,
      persistent: true,
      ignoreInitial: true,
      cwd: srcPath,
    }).pipe(queue.in)
  }

  // clean for now
  // TODO: remove this
  await clean(destPath)

  return await new Promise(resolve => {
    pipeline(
      // Run compilation rules
      rulesPipeline({
        srcPath,
        destPath,
        entries: entryPaths,
        errorHandler,
      })(queue.in),

      // File sync
      gulpIf(isUnlinkFile, unlink(destPath), dest(destPath)),

      // This tracks to see if we are ready
      queue.trackDone,

      // Maintain build manifest
      setManifestEntry(manifest),
      createManifestFile(manifest, manifestPath),
      gulpIf(writeManifestFile, dest(srcPath)),

      // error handler needs to be here too
      errorHandler,
    ).on('data', () => {
      if (queue.ready()) {
        resolve({manifest})
      }
    })
  })
}
const isUnlinkFile = (file: File) => {
  return file.event === 'unlink' || file.event === 'unlinkDir'
}
