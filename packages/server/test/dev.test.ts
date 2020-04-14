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
  const rootFolder = resolve(__dirname, './fixtures/dev')
  const buildFolder = resolve(rootFolder, '.blitz')
  const devFolder = resolve(rootFolder, '.blitz-dev')

  beforeEach(async () => {
    jest.clearAllMocks()
    await dev({rootFolder, buildFolder, devFolder, writeManifestFile: false, watch: false})
  })

  afterEach(async () => {
    if (await pathExists(devFolder)) {
      await remove(devFolder)
    }
  })

  it('should copy the correct files to the dev folder', async () => {
    const tree = directoryTree(rootFolder)
    expect(tree).toEqual({
      name: 'dev',
      children: [
        {
          name: '.blitz-dev',
          children: [{name: 'one'}, {name: 'two'}],
        },
        {name: '.now'},
        {name: 'one'},
        {name: 'two'},
      ],
    })
  })

  it('calls spawn with the patched next cli bin', () => {
    expect(nextUtilsMock.nextStartDev.mock.calls[0][0]).toBe(`${rootFolder}/node_modules/.bin/next-patched`)
    expect(nextUtilsMock.nextStartDev.mock.calls[0][1]).toBe(`${rootFolder}/.blitz-dev`)
  })
})
