#!/bin/bash
npx typeorm-model-generator -h localhost -d twoelephantsfireworks -u root -x "" -e mysql -o /tmp/
mv /tmp/entities/* ./src/entity