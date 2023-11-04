#!/bin/bash

###################################################################
### Add branch to changelog
###################################################################
# Get the current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Get the current date and time
date=$(date +%Y-%m-%d)

# Find the first occurrence of ### Added
line_number=$(grep -n "### Added" Changelog.md | head -1 | cut -d: -f1)

# Check if the branch has already been added to the Changelog
if grep -q " $branch " Changelog.md; then
	echo "Branch $branch has already been added to the Changelog."
else
	# Add the branch name and date to the Changelog file
	sed -i "${line_number}a\  - $branch ($date)" Changelog.md

	# Commit the change to the Changelog file
	git add Changelog.md
fi