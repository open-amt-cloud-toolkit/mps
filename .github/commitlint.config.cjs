module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [
      2,
      'always',
      200
    ],
    'subject-case': [
      1,
      'never',
      [
        'sentence-case',
        'start-case',
        'pascal-case',
        'upper-case'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'db',
        'api',
        'secrets',
        'cira',
        'apf',
        'health',
        'utils',
        'redir',
        'events',
        'docker',
        'deps',
        'deps-dev',
        'gh-actions',
        'config'
      ]
    ]
  }
}
