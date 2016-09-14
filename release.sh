!#/bin/bash

clear
mkdir -p release
cp -r -u * release/
cd release
find . -name "*.sass" -type f -delete
find . -name "*._sass" -type f -delete
find . -name "*.psd" -type f -delete
find . -name "*.ai" -type f -delete

rm -r image/design
rm -r maps/
rm README.md
