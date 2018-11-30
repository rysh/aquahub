#!/bin/bash
gcloud beta functions deploy helloGET \
  --trigger-http \
  --runtime=nodejs8 \
  --timeout=180s \
  --memory=1024MB
