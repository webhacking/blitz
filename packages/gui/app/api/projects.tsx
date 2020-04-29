import spawn from "cross-spawn"
import { createWriteStream, promises, WriteStream } from "fs"
import p from "pdsl"
import { NextApiRequest, NextApiResponse } from "next"

const runScript = (
  command: string,
  args: string[] | undefined,
  cwd: string,
  logStream: WriteStream,
  callback: (exitCode: number) => void
) => {
  // this doesn’t actually work (it creates somewhere in .blitz). how do we get the right path?
  const child = spawn(command, args, { cwd })

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

const isValid = p`{|
  id: string,
  name: string,
  cwd: string
|}`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const output = await promises.readFile(`${req.query.id}.txt`, "utf-8")

    return res.status(200).json({ output })
  } else if (req.method === "POST") {
    if (!isValid(req.body)) {
      return res.status(400).end()
    }

    const logStream = createWriteStream(`${req.body.id}.txt`, { flags: "a" })

    runScript("blitz", ["new", req.body.name], req.body.cwd, logStream, (exitCode: number) => {
      return res.status(200).json({ output: "hi", exitCode })
    })
  }

  return res.status(404).end()
}
