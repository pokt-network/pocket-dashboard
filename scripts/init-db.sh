#!/usr/bin/env bash

# COLOR
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Start devenv 
HOST_UID=$(id -u) HOST_GID=$(id -g) docker-compose up -d

# Init DB (needs mongo utils installed)
mongoimport --type csv --uri mongodb://localhost:27017/gateway-testnet --collection Blockchains --drop --file ./packages/backend/networkIDs.csv --columnsHaveTypes --fields="_id.string(),ticker.string(),networkID.string(),network.string(),description.string(),index.int32(),blockchain.string(),active.boolean()"

if [ $? -ne 0 ]
then
    echo " "
    echo -e "${RED}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                                 **"
    echo "**      Not able to initialize the DB! make sure you have docker installed.        **"
    echo "**                                                                                 **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

    exit 1
else
    echo " "
    echo -e "${GREEN}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                                 DB initialized!                              **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"
fi

# finally, kill containers 
HOST_UID=$(id -u) HOST_GID=$(id -g) docker-compose down

echo "Done!"