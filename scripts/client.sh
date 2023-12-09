#!/bin/bash

cd client
npm install
npm run build
npm install -g serve
serve -s build -l 3000