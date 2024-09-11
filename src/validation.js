const deps = new Map()
deps.set(
  'numpy',
  Map([
    ['3.12', '1.26.0', null],
    ['3.11', '1.23.2', null],
    ['3.10', '1.21.3', null],
    ['3.9', '1.19.3', '2.0.2']
  ])
)

export function findClosestVersion(pkgName, pkgVersion, pythonVersion) {
  console.log(`${deps}`)
  return pkgVersion
}
