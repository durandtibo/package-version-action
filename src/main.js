const core = require('@actions/core')

try {
  const pkgName = core.getInput('package-name')
  console.log(`pkgName: ${pkgName}`)
  const pkgVersion = core.getInput('package-version')
  console.log(`pkgVersion: ${pkgVersion}`)
  const pythonVersion = core.getInput('python-version')
  console.log(`pythonVersion: ${pythonVersion}`)

  const time = new Date().toTimeString()
  core.setOutput('time', time)
} catch (error) {
  core.setFailed(error.message)
}
