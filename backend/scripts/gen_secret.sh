#!/bin/bash

openssl rand -base64 32 | tr -d '\n=' | cut -c1-43