const core = require('@actions/core')

try {
  const pkgName = core.getInput('package-name')
  const pkgVersion = core.getInput('package-version')
  const pythonVersion = core.getInput('python-version')
  console.log(
    `pkgName: ${pkgName}\npkgVersion: ${pkgVersion}\npythonVersion: ${pythonVersion}`
  )

  core.setOutput('closest-valid-version', pkgVersion)

  const time = new Date().toTimeString()
  core.setOutput('time', time)
} catch (error) {
  core.setFailed(error.message)
}
