#!/bin/bash

inotifywait -e modify -m $(pwd) | while read EV; do
    systemctl reload nginx
done
