import {resolveFilepath} from './watch'
import vinyl from 'vinyl-file'
import File from 'vinyl'
import crypto from 'crypto'
import {Transform} from 'readable-stream'
import {Stats} from 'fs'

// entry point for fileTrasform
function equals<T>(as: Set<T>, bs: Set<T>) {
  if (as.size !== bs.size) return false
  for (let a of as) if (!bs.has(a)) return false
  return true
}

function inter<T>(...sets: Set<T>[]) {
  const [set1, ...otherSets] = sets
  return new Set([...set1].filter(x => otherSets.every(set => set.has(x))))
}

type Entry = {path: string; event?: string; stats: Stats}

class QueueIn extends Transform {
  constructor(private todo: Set<string>, private done: Set<string>, private srcPath: string) {
    super({objectMode: true})
  }

  async _transform({path, event, stats}: Entry, _: any, next: (err?: any, file?: File) => void) {
    const id = crypto
      .createHash('md5')
      .update(JSON.stringify({path, s: stats?.mtimeMs}))
      .digest('hex')

    if (this.done.has(id)) {
      next()
      return
    }

    const filepath = resolveFilepath(path, this.srcPath)
    const file = await vinyl.read(filepath, {cwd: this.srcPath, read: true})

    file.id = id
    if (event) file.event = event

    this.todo.add(id)

    next(undefined, file)
  }
}

class TrackDone extends Transform {
  constructor(private done: Set<string>) {
    super({objectMode: true})
  }

  _transform(file: {id: string}, _: any, next: Function) {
    this.done.add(file.id)
    next(undefined, file)
  }
}

// Manage toDo and done set and report when ready
export function createFileQueue(srcPath: string) {
  const todo = new Set<string>()
  const done = new Set<string>()

  const input = new QueueIn(todo, done, srcPath)

  const trackDone = new TrackDone(done)

  function ready() {
    return equals(todo, inter(todo, done))
  }

  return {in: input, trackDone, ready}
}
