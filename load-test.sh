#!/bin/bash
AUTH_TOKEN=token

curl -v -X POST http://localhost:3000/api/document/upload -b "MSS_SESSION_TOKEN=${AUTH_TOKEN}" -F "file=@load-test-file.pdf;type=application/pdf" -F "input=</tmp/input.json"
