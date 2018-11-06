'use strict'

const github = require('octonode')

module.exports.githubCheck = (event, context, callback) => {
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
  const githubToken = process.env.GITHUB_TOKEN
  const github_client = github.client(githubToken)
  let response = {
    statusCode: 204
  }

  if (typeof webhookSecret !== 'string') {
    response = {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable'
    }
    return callback(null, response);
  }

  let body = JSON.parse(event.body)
  /* eslint-disable */
  console.log('---------------------------------');
  console.log('Input body', body);
  /* eslint-enable */
  if (!body || !body.hasOwnProperty('pull_request')) {
    return callback(null, response)
  }

  let payload = {
    state: 'success',
    description: 'PR title according to format',
    context: 'serverless-webhook/pr-title'
  }
  github_client.post(`/repos/${body.repository.full_name}/statuses/${body.pull_request.head.sha}`, payload, function () {
    callback(null, response)
  })
};
