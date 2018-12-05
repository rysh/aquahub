#!/bin/bash
cp ../utils.js ./
cp ~/src/aquahub-private/crawler_env.yml ./
gcloud beta functions deploy crawlAnaquarium \
  --trigger-http \
  --runtime=nodejs8 \
  --timeout=180s \
  --memory=1024MB \
  --region=asia-northeast1 \
  --env-vars-file=crawler_env.yml 
