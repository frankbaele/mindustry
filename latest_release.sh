#!/usr/bin/env bash
get_latest_release() {
  curl --silent "https://api.github.com/repos/Anuken/Mindustry/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/'                                    # Pluck JSON value
}

get_latest_release