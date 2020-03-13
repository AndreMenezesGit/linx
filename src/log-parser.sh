#!/bin/bash
cat /var/log/nginx/access.log | awk '{print $9 " " $7}' | sort | uniq -c | sort -rn
