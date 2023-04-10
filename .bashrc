#!/bin/bash 
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm 
cd /usr/home/gcpharma/GermanCapitalPharma &&
/usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/node 
/usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/pm2 start 
/usr/home/gcpharma/GermanCapitalPharma/lib/server.js