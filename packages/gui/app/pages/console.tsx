import { useEffect, useState } from "react"

export default () => {
  const [output, setOutput] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/commands/new?id=${"creation-1"}`)
      const json = await res.json()
      setOutput(json.output)
    }

    fetchData()
  }, [])

  return (
    <div className="h-screen overflow-auto font-mono text-sm text-white bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      {output.split("\n").map((line: string) => (
        <p>{line}</p>
      ))}
    </div>
  )
}
