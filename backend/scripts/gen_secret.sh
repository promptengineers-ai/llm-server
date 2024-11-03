#!/bin/bash

python3 -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'