#!/bin/bash

for i in {1..10000}; do

  curl http://localhost:3000 > /tmp/app-logs.txt
  sleep $1

done
