const { findConfig, findClosestVersion, printMap } = require('../src/main')

mockAllConfig = new Map([
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
  expect(findConfig('my_package', '3.11', new Map())).toStrictEqual([
    null,
    null
  ])
})

test('find config missing package', () => {
  expect(
    findConfig('my_package', '3.11', new Map([['numpy', new Map()]]))
  ).toStrictEqual([null, null])
})

test('find config missing python version', () => {
  expect(
    findConfig('my_package', '3.11', new Map([['my_package', new Map()]]))
  ).toStrictEqual([null, null])
})

test('find config exist min', () => {
  expect(findConfig('my_package', '3.12', mockAllConfig)).toStrictEqual([
    '1.5.0',
    null
  ])
})

test('find config exist min and max', () => {
  expect(findConfig('my_package', '3.11', mockAllConfig)).toStrictEqual([
    '1.2.0',
    '1.8.0'
  ])
})

test('find config exist max', () => {
  expect(findConfig('my_package', '3.10', mockAllConfig)).toStrictEqual([
    null,
    '1.3.0'
  ])
})

test('find config exist null', () => {
  expect(findConfig('my_package', '3.9', mockAllConfig)).toStrictEqual([
    null,
    null
  ])
})

//////////////////////////////////
// Tests for findClosestVersion //
//////////////////////////////////

test('find closest version empty', () => {
  expect(
    findClosestVersion('my_package', '1.2.3', '3.11', new Map())
  ).toStrictEqual('1.2.3')
})

test('find closest version min valid', () => {
  expect(
    findClosestVersion('my_package', '1.7.3', '3.12', mockAllConfig)
  ).toStrictEqual('1.7.3')
})

test('find closest version min invalid', () => {
  expect(
    findClosestVersion('my_package', '1.2.3', '3.12', mockAllConfig)
  ).toStrictEqual('1.5.0')
})

test('find closest version min and max valid', () => {
  expect(
    findClosestVersion('my_package', '1.5.0', '3.11', mockAllConfig)
  ).toStrictEqual('1.5.0')
})

test('find closest version min and max invalid lower', () => {
  expect(
    findClosestVersion('my_package', '1.0.3', '3.11', mockAllConfig)
  ).toStrictEqual('1.2.0')
})

test('find closest version min and max invalid higher', () => {
  expect(
    findClosestVersion('my_package', '2.0.3', '3.11', mockAllConfig)
  ).toStrictEqual('1.8.0')
})

test('find closest version max valid', () => {
  expect(
    findClosestVersion('my_package', '1.2.3', '3.10', mockAllConfig)
  ).toStrictEqual('1.2.3')
})

test('find closest version max invalid', () => {
  expect(
    findClosestVersion('my_package', '1.7.3', '3.10', mockAllConfig)
  ).toStrictEqual('1.3.0')
})

test('find closest version null', () => {
  expect(
    findClosestVersion('my_package', '1.2.3', '3.9', mockAllConfig)
  ).toStrictEqual('1.2.3')
})

////////////////////////
// Tests for printMap //
////////////////////////

test('print empty map', () => {
  printMap(new Map())
})

test('print map', () => {
  printMap(
    new Map([
      ['3.12', ['1.5.0', null]],
      ['3.11', ['1.2.0', '1.8.0']],
      ['3.10', [null, '1.3.0']],
      ['3.9', [null, null]]
    ])
  )
})

test('print nested map', () => {
  printMap(mockAllConfig)
})
