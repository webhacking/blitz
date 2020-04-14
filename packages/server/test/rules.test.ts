/* eslint-disable import/first */

const nextUtilsMock = {
  nextStartDev: jest.fn().mockReturnValue(Promise.resolve()),
}
// Quieten reporter
jest.doMock('../src/reporter', () => ({
  reporter: {copy: jest.fn(), remove: jest.fn()},
}))

// Assume next works
jest.doMock('../src/next-utils', () => nextUtilsMock)

// Import with mocks applied
import {dev} from '../src/dev'
import {resolve} from 'path'
import {remove, pathExists} from 'fs-extra'
import {directoryTree} from './utils/tree-utils'

describe('Dev command', () => {
  const rootFolder = resolve(__dirname, './fixtures/rules')
  const buildFolder = resolve(rootFolder, '.blitz')
  const devFolder = resolve(rootFolder, '.blitz-rules')

  beforeEach(async () => {
    jest.clearAllMocks()
    await dev({rootFolder, buildFolder, devFolder, writeManifestFile: false})
  })

  afterEach(async () => {
    if (await pathExists(devFolder)) {
      await remove(devFolder)
    }
  })

  it('should copy the correct files to the dev folder', async () => {
    await new Promise(res => setTimeout(res, 3000))
    const tree = directoryTree(devFolder)
    expect(tree).toEqual({
      name: '.blitz-rules',
      children: [
        {
          name: 'pages',
          children: [{name: 'bar.tsx'}, {name: 'foo.tsx'}],
        },
      ],
    })
  })
})
