const core = require('@actions/core')
const semver = require('semver')

// Extra argument for printing with indentation
function printMap(map, tab = '') {
  for (const [k, v] of map.entries()) {
    // Don't print here yet...
    if (v instanceof Map) {
      core.debug(`${tab}${k}:`) // Only print the key here...
      printMap(v, tab + '    ') // ...as recursion will take care of the value(s)
    } else {
      core.debug(`${tab}${k} = ${v}`)
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
  if (!allConfigs.has(pkgName)) {
    return [null, null]
  }
  const pkgConfig = allConfigs.get(pkgName)
  if (!pkgConfig.has(pythonVersion)) {
    return [null, null]
  }
  return pkgConfig.get(pythonVersion)
}

function findClosestVersion(pkgName, pkgVersion, pythonVersion, allConfigs) {
  const [minVersion, maxVersion] = findConfig(
    pkgName,
    pythonVersion,
    allConfigs
  )
  core.debug(`${minVersion}  ${maxVersion}`)
  if (minVersion === null && maxVersion === null) {
    return pkgVersion
  }
  if (minVersion === null) {
    return semver.lte(pkgVersion, maxVersion) ? pkgVersion : maxVersion
  }
  if (maxVersion === null) {
    return semver.gte(pkgVersion, minVersion) ? pkgVersion : minVersion
  }
  if (semver.gt(pkgVersion, maxVersion)) {
    return maxVersion
  }
  if (semver.lt(pkgVersion, minVersion)) {
    return minVersion
  }
  return pkgVersion
}

async function run() {
  try {
    const pkgName = core.getInput('package-name')
    const pkgVersion = core.getInput('package-version')
    const pythonVersion = core.getInput('python-version')
    core.debug(
      `pkgName: ${pkgName}\npkgVersion: ${pkgVersion}\npythonVersion: ${pythonVersion}`
    )

    closestPkgVersion = findClosestVersion(
      pkgName,
      pkgVersion,
      pythonVersion,
      deps
    )
    core.debug(`closestPkgVersion ${closestPkgVersion}`)
    core.setOutput('closest-valid-version', closestPkgVersion)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  findConfig: findConfig,
  findClosestVersion: findClosestVersion,
  printMap: printMap,
  run: run
}
