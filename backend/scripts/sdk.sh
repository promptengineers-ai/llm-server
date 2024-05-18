#!/bin/bash

WORSKPACE=$(pwd)

# pip install --upgrade pip
pip install -r requirements.txt
echo ""
echo ">>> installed requirements..."
echo ""

cd $HOME/repos/promptengineers/core
echo ">>> changed directory to core..."
echo ""

rm -r ~/.cache/pip/selfcheck/
pip install -e .
pip install -e .[retrieval]
echo ">>> installed core..."
echo ""

cd $WORSKPACE
echo ">>> changed directory to $WORSKPACE..."
echo ""

echo "reinstall complete..."

