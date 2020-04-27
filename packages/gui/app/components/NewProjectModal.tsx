import { useState, FormEvent } from "react"
import { animated, useTransition } from "react-spring"

export const NewProjectModal = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const [name, setName] = useState("")

  const props = useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log(name)
  }

  return (
    <>
      {props.map(({ item, props, key }) => {
        return item ? (
          <animated.div
            key={key}
            style={props}
            className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
          >
            <div onClick={close} className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg overflow-hidden shadow-xl transform sm:max-w-xl sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-6 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 w-full sm:mt-0 sm:ml-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg leading-6 font-medium">New project</h3>
                      <div className="mt-2">
                        <p className="text-sm leading-5 text-gray-500">
                          Fill out the information below to get started.
                        </p>
                      </div>
                    </div>

                    <label htmlFor="name" className="mt-4 block  text-sm leading-5 font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 form-input w-full"
                      autoFocus
                    />

                    {/* This input was included in the original design spec. I’m not sure we want it 
                        though, especially since that’s not something our CLI supports.
                    */}
                    {/* <div className="mt-4">
                      <span className="block text-sm leading-5 font-medium text-gray-700">
                        Package manager
                      </span>
                      <div className="mt-1">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-indigo-600"
                            name="package-manager"
                            value="yarn"
                          />
                          <span className="ml-2">Yarn</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            className="form-radio text-indigo-600"
                            name="package-manager"
                            value="npm"
                          />
                          <span className="ml-2">NPM</span>
                        </label>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  >
                    Create
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  >
                    Cancel
                  </button>
                </span>
              </div>
            </form>
          </animated.div>
        ) : null
      })}
    </>
  )
}
