#!/bin/bash

ENV_FILE=.env.local

### Set Environment Variables
set -a # automatically export all variables
source $ENV_FILE
set +a

if [ -z "$1" ]
then
   echo ">> Running all test cases"
    python3 -m pytest -s tests
else
   echo ">> Running single test case"
    python3 -m pytest -s $@
fi