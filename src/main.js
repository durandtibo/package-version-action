import { findClosestVersion } from './src/validation.js'

const core = require('@actions/core')

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
