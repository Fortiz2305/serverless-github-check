'use strict'

const github = require('octonode')

const checkWebhookSecret = (secret) => {
  if (typeof secret !== 'string') {
    response = {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable'
    }
    return callback(null, response);
  }
}

module.exports.githubCheck = (event, context, callback) => {
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
  const githubToken = process.env.GITHUB_TOKEN
  const github_client = github.client(githubToken)

  checkWebhookSecret(webhookSecret)
  let body = JSON.parse(event.body)
  let response = { statusCode: 204 }
  /* eslint-disable */
  console.log('---------------------------------');
  console.log('Input body', event.body);
  /* eslint-enable */
  if (!body || !body.hasOwnProperty('pull_request')) {
    response['body'] = 'Event is not a Pull request'
    return callback(null, response)
  }

  let payload = {
    state: 'success',
    description: 'PR title according to format',
    context: 'serverless-webhook/pr-title'
  }

  if (!body.pull_request.body.startsWith('Related to: https://trello.com') {
    payload.state = 'failure'
    payload.description = 'PR title should start with a ticket number';
  }

  github_client.post(`/repos/${body.repository.full_name}/statuses/${body.pull_request.head.sha}`, payload, function () {
    callback(null, response)
  })
};
