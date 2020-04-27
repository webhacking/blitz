import { useQuery } from "react-query"

const runNewCommand = async () => {
  const res = await fetch("http://localhost:3000/api/commands/new")
  const json = await res.json()
  return json
}

export default () => {
  const { data } = useQuery("output", runNewCommand, {
    refetchInterval: 100,
  })

  return (
    <div className="h-screen overflow-auto font-mono text-sm text-white bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      {data && data.output.split("\n").map((line: string) => <p>{line}</p>)}
    </div>
  )
}
