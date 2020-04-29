import { NextApiRequest, NextApiResponse } from "next"
import { homedir } from "os"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return res.status(200).json({ homedir: homedir() })
  }

  return res.status(404)
}
