const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

allConfigMock = new Map([
  [
    'my_package',
    new Map([
      ['3.12', ['1.5.0', null]],
      ['3.11', ['1.2.0', '1.8.0']],
      ['3.10', [null, '1.3.0']],
      ['3.9', [null, null]]
    ])
  ]
])

//////////////////////////
// Tests for findConfig //
//////////////////////////

test('find config empty', () => {
  expect(main.findConfig('my_package', '3.11', new Map())).toStrictEqual([
    null,
    null
  ])
})

test('find config missing package', () => {
  expect(
    main.findConfig('my_package', '3.11', new Map([['numpy', new Map()]]))
  ).toStrictEqual([null, null])
})

test('find config missing python version', () => {
  expect(
    main.findConfig('my_package', '3.11', new Map([['my_package', new Map()]]))
  ).toStrictEqual([null, null])
})

test('find config exist min', () => {
  expect(main.findConfig('my_package', '3.12', allConfigMock)).toStrictEqual([
    '1.5.0',
    null
  ])
})

test('find config exist min and max', () => {
  expect(main.findConfig('my_package', '3.11', allConfigMock)).toStrictEqual([
    '1.2.0',
    '1.8.0'
  ])
})

test('find config exist max', () => {
  expect(main.findConfig('my_package', '3.10', allConfigMock)).toStrictEqual([
    null,
    '1.3.0'
  ])
})

test('find config exist null', () => {
  expect(main.findConfig('my_package', '3.9', allConfigMock)).toStrictEqual([
    null,
    null
  ])
})

//////////////////////////////////
// Tests for findClosestVersion //
//////////////////////////////////

test('find closest version empty', () => {
  expect(
    main.findClosestVersion('my_package', '1.2.3', '3.11', new Map())
  ).toStrictEqual('1.2.3')
})

test('find closest version min valid', () => {
  expect(
    main.findClosestVersion('my_package', '1.7.3', '3.12', allConfigMock)
  ).toStrictEqual('1.7.3')
})

test('find closest version min invalid', () => {
  expect(
    main.findClosestVersion('my_package', '1.2.3', '3.12', allConfigMock)
  ).toStrictEqual('1.5.0')
})

test('find closest version min and max valid', () => {
  expect(
    main.findClosestVersion('my_package', '1.5.0', '3.11', allConfigMock)
  ).toStrictEqual('1.5.0')
})

test('find closest version min and max invalid lower', () => {
  expect(
    main.findClosestVersion('my_package', '1.0.3', '3.11', allConfigMock)
  ).toStrictEqual('1.2.0')
})

test('find closest version min and max invalid higher', () => {
  expect(
    main.findClosestVersion('my_package', '2.0.3', '3.11', allConfigMock)
  ).toStrictEqual('1.8.0')
})

test('find closest version max valid', () => {
  expect(
    main.findClosestVersion('my_package', '1.2.3', '3.10', allConfigMock)
  ).toStrictEqual('1.2.3')
})

test('find closest version max invalid', () => {
  expect(
    main.findClosestVersion('my_package', '1.7.3', '3.10', allConfigMock)
  ).toStrictEqual('1.3.0')
})

test('find closest version null', () => {
  expect(
    main.findClosestVersion('my_package', '1.2.3', '3.9', allConfigMock)
  ).toStrictEqual('1.2.3')
})

////////////////////////
// Tests for printMap //
////////////////////////

test('print empty map', () => {
  main.printMap(new Map())
})

test('print map', () => {
  main.printMap(
    new Map([
      ['3.12', ['1.5.0', null]],
      ['3.11', ['1.2.0', '1.8.0']],
      ['3.10', [null, '1.3.0']],
      ['3.9', [null, null]]
    ])
  )
})

test('print nested map', () => {
  main.printMap(allConfigMock)
})

///////////////////
// Tests for run //
///////////////////

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('check numpy 2.0.2 and python 3.11', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'package-name':
          return 'numpy'
        case 'package-version':
          return '2.0.2'
        case 'python-version':
          return '3.11'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'closest-valid-version',
      '2.0.2'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'is-valid-version', true)
  })

  it('check numpy 1.10.0 and python 3.11', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'package-name':
          return 'numpy'
        case 'package-version':
          return '1.10.0'
        case 'python-version':
          return '3.11'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'closest-valid-version',
      '1.23.2'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'is-valid-version', false)
  })
})
