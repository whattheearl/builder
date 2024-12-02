# ==================================================================================== #
# VARIABLES
# ==================================================================================== #

SERVER=wte.sh
CONTAINER_REGISTRY=ghcr.io
CONTAINER_REGISTRY_USER=whattheearl
TAG=ghcr.io/whattheearl/builder:latest
BUILD_PATH=/home/jon/wte/builder

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@echo ${MAKEFILE_LIST}
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure [y/N]' && read ans && [ $${ans:-N} = y ]

.PHONY: no-dirty
no-dirty:
	@test -z "$(shell git status --porcelain)"

# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## format: format files
.PHONY: format
format:
	@npm run format 

## format: format files
.PHONY: lint 
lint:
	@npm run lint

# ==================================================================================== #
# DEVELOPMENT 
# ==================================================================================== #

## dev: starts dev server
.PHONY: dev 
dev:
	npm i;
	npm run dev;

# ==================================================================================== #
# PUBLISH 
# ==================================================================================== #

## login: login to container registry
.PHONY: login
login:
	@echo ${GITHUB_TOKEN} | docker login ${CONTAINER_REGISTRY} -u ${CONTAINER_REGISTRY_USER} --password-stdin

## build: build container
.PHONY: build
build:
	@docker build . --tag ${TAG}

## publish: publish docker container
.PHONY: publish 
publish:
	@docker push ${TAG}

# ==================================================================================== #
# DEPLOYMENT
# ==================================================================================== #

## start: start service 
.PHONY: start 
start: 
	@docker compose pull
	@docker compose up -d

## stop: stop service 
.PHONY: stop 
stop: 
	@docker compose stop

## env: sync environmental variables
.PHONY: env
env:
	# @ssh ${SERVER} "rm -rf ${BUILD_PATH}; git clone https://github.com/whattheearl/builder ${BUILD_PATH}"
	# @scp .env.prod "${SERVER}:${BUILD_PATH}/.env.prod"
	@scp Makefile "${SERVER}:${BUILD_PATH}/Makefile"

## deploy: deploy service
# .PHONY: deploy
deploy: env
	# @ssh ${SERVER} "make -C ${BUILD_PATH} build"
	# @ssh ${SERVER} "make -C ${BUILD_PATH} publish"
	# @ssh ${SERVER} "make -C ${BUILD_PATH} start"
