#!/bin/bash

###################################################################
### Add branch to changelog
###################################################################
# Get the current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Get the current date and time
date=$(date +%Y-%m-%d)

# Define the path to the Changelog file one directory up
changelog_path="Changelog.md"

# Function to add a branch entry
add_branch_entry() {
    local header="$1"
    local branch="$2"
    local date="$3"
    
    # Find the first occurrence of the header
    line_number=$(grep -n "### $header" $changelog_path | head -1 | cut -d: -f1)

    if [ -z "$line_number" ]; then
        # Header does not exist, find the last semver header
        last_semver_line=$(grep -n "^## " $changelog_path | head -1 | cut -d: -f1)
        # Insert the new header after the last semver header
        sed -i "${last_semver_line}a\\\n### $header\n  - $branch ($date)" $changelog_path
    else
        # Header exists, add the branch entry under the header
        sed -i "${line_number}a\  - $branch ($date)" $changelog_path
    fi
}

# Check if the branch has already been added to the Changelog
if grep -q " $branch " $changelog_path; then
    echo "Branch $branch has already been added to the Changelog."
else
    # Determine the appropriate header based on the branch prefix
    if [[ $branch == feature/* ]]; then
        add_branch_entry "Changed" "$branch" "$date"
    elif [[ $branch == bugfix/* ]]; then
        add_branch_entry "Fixed" "$branch" "$date"
    else
        echo "Branch $branch does not match any known prefix (feature/ or bugfix/)."
    fi
fi
