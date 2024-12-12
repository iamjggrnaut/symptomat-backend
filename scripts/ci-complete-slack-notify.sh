#!/bin/bash
WEBHOOK_URL=${1}
ENVIRONMENT=${2^}
CURRENT_BRANCH=${3}
LAST_COMMIT=${4}
DOCKER_IMAGE=${5}
ICON_EMOJI=${6-:astronaut::skin-tone-3:}

DATA='{
  "username":"GitLab CI - Backend - ENVIRONMENT_VAR",
  "icon_emoji":"ICON_EMOJI_VAR",
  "blocks":[
    {
      "type":"section",
      "text":{
        "type":"mrkdwn",
        "text":"New version has beed deployed."
      }
    }
  ],
  "attachments":[
    {
      "color":"#ff9800",
      "fields":[
        {
          "title":"Git",
          "value":"CURRENT_BRANCH_VAR\nLAST_COMMIT_VAR"
        }
      ]
    },
    {
      "color":"#03a9f4",
      "fields":[
        {
          "title":"Image",
          "value":"DOCKER_IMAGE_VAR"
        }
      ]
    },
    {
      "color":"#8bc34a",
      "fields":[
        {
          "value":"http://178.154.221.27/graphql",
        },
          {
          "value":"http://178.154.221.27/api",
        }
      ]
    }
  ]
}'

DATA=${DATA//CURRENT_BRANCH_VAR/$CURRENT_BRANCH}
DATA=${DATA//LAST_COMMIT_VAR/$LAST_COMMIT}
DATA=${DATA//ENVIRONMENT_VAR/$ENVIRONMENT}
DATA=${DATA//DOCKER_IMAGE_VAR/$DOCKER_IMAGE}
DATA=${DATA//ICON_EMOJI_VAR/$ICON_EMOJI}

curl -d "$DATA" -H "Content-Type: application/x-www-form-urlencoded" -X POST $WEBHOOK_URL
