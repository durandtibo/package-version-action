const core = require('@actions/core')

// Extra argument for printing with indentation
function printMap(map, tab = '') {
  for (const [k, v] of map.entries()) {
    // Don't print here yet...
    if (v instanceof Map) {
      console.log(`${tab}${k}:`) // Only print the key here...
      printMap(v, tab + '    ') // ...as recursion will take care of the value(s)
    } else {
      console.log(`${tab}${k} = ${v}`)
    }
  }
}

const deps = new Map()
deps.set(
  'numpy',
  new Map([
    ['3.12', ['1.26.0', null]],
    ['3.11', ['1.23.2', null]],
    ['3.10', ['1.21.3', null]],
    ['3.9', ['1.19.3', '2.0.2']]
  ])
)

function findConfig(pkgName, pythonVersion, allConfigs) {
  console.log(`${printMap(allConfig)}`)
  if (!allConfigs.has(pkgName)) {
    return new Map()
  }
  const pkgConfig = allConfigs.get(pkgName)
  if (!pkgConfig.has(pythonVersion)) {
    return new Map()
  }
  return pkgConfig.get(pythonVersion)
}

function findClosestVersion(pkgName, pkgVersion, pythonVersion) {
  config = findConfig(pkgName, pythonVersion, deps)
  console.log(`${printMap(config)}`)
  return pkgVersion
}

try {
  const pkgName = core.getInput('package-name')
  const pkgVersion = core.getInput('package-version')
  const pythonVersion = core.getInput('python-version')
  console.log(
    `pkgName: ${pkgName}\npkgVersion: ${pkgVersion}\npythonVersion: ${pythonVersion}`
  )

  closestPkgVersion = findClosestVersion(pkgName, pkgVersion, pythonVersion)
  core.setOutput('closest-valid-version', closestPkgVersion)

  const time = new Date().toTimeString()
  core.setOutput('time', time)
} catch (error) {
  core.setFailed(error.message)
}
