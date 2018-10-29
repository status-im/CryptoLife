#!/usr/bin/env bash

# rm -rf build
ganache-cli --defaultBalanceEther=1000 --gasPrice=1 --gasLimit=0xffffffff --port=8666 --accounts=20 > /tmp/testrpc.log 2>&1 &
truffle test --network=test $1
kill $(lsof -t -i :8666)
