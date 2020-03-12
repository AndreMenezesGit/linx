#!/bin/bash

for i in {1..10000}; do

  curl http://localhost:3000 >> /tmp/app-access-logs.txt
done
