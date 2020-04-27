import spawn from "cross-spawn"
import { NextApiRequest, NextApiResponse } from "next"

let output = ""

const runScript = (command: string, args: string[] | undefined, callback: any) => {
  const child = spawn(command, args, { cwd: process.cwd() })

  if (child.stdout) {
    child.stdout.setEncoding("utf8")
    child.stdout.on("data", (data) => {
      data = data.toString()
      output += data
    })
  }

  if (child.stderr) {
    child.stderr.setEncoding("utf8")
    child.stderr.on("data", (data) => {
      data = data.toString()
      output += data
    })
  }

  child.on("close", (code) => {
    callback(output, code)
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return res.status(200).json({ output })
  } else if (req.method === "POST") {
    runScript("mkdir", [req.body.name], (output: string, exitCode: number) => {
      return res.status(200).json({ output, exitCode })
    })
  }

  return res.status(404)
}

// import { spawn } from "node-pty"
// import { NextApiRequest, NextApiResponse } from "next"

// let output = ""

// const runScript = (command: string, args: string | string[], callback: any) => {
//   const child = spawn(command, args, {
//     name: "xterm-color",
//     cols: 80,
//     rows: 30,
//     cwd: process.cwd(),
//   })

//   child.on("data", (data) => {
//     output += data
//   })

//   child.on("exit", (code) => {
//     callback(output, code)
//   })
// }

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "GET") {
//     return res.status(200).json({ output })
//   } else if (req.method === "POST") {
//     runScript("yarn", [], (output: string, exitCode: number) => {
//       return res.status(200).json({ output, exitCode })
//     })
//   }

//   return res.status(404)
// }
