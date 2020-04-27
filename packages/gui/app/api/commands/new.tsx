import spawn from "cross-spawn"
import { createWriteStream, promises, WriteStream } from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import { join } from "path"

const runScript = (
  command: string,
  args: string[] | undefined,
  logStream: WriteStream,
  callback: (exitCode: number) => void
) => {
  // this doesn’t actually work (it creates somewhere in .blitz). how do we get the right path?
  const child = spawn(command, args, { cwd: process.cwd() })

  if (child.stdout) {
    child.stdout.setEncoding("utf-8")
    child.stdout.on("data", (data) => {
      logStream.write(data)
    })
  }

  if (child.stderr) {
    child.stderr.setEncoding("utf-8")
    child.stderr.on("data", (data) => {
      logStream.write(data)
    })
  }

  child.on("close", (exitCode) => {
    logStream.end()
    callback(exitCode)
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const output = await promises.readFile(`${req.query.id}.txt`, "utf-8")

    return res.status(200).json({ output })
  } else if (req.method === "POST") {
    const logStream = createWriteStream(`${req.body.id}.txt`, { flags: "a" })

    runScript("blitz", ["new", req.body.name], logStream, (exitCode: number) => {
      return res.status(200).json({ output: "hi", exitCode })
    })
  }

  return res.status(404)
}
