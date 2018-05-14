# Lasting Legacy

lasting-legacy:
testrpc --rpc --rpccorsdomain="chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
truffle migrate --reset --recompile --compile-all

lasting-legacyUI:
webpack -d
node app

localhost:3000
