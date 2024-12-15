SERVER=wte.sh
CONTAINER_REGISTRY=ghcr.io
CONTAINER_REGISTRY_USER=whattheearl
TAG=ghcr.io/whattheearl/jithub:latest
BUILD_PATH=/home/jon/wte/jithub

.PHONY: help login build publish start stop env deploy
## help
help:
	@echo 'Usage:'
	@echo ${MAKEFILE_LIST}
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

login:
	@echo ${GITHUB_TOKEN} | docker login ${CONTAINER_REGISTRY} -u ${CONTAINER_REGISTRY_USER} --password-stdin

## build: build container
build:
	@docker build . --tag ${TAG}

## publish: publish docker container
publish:
	@docker push ${TAG}

## start: start service 
start: 
	@docker compose pull
	@docker compose up -d

## stop: stop service 
stop: 
	@docker compose stop

## env: sync environmental variables
env:
	@scp Makefile "${SERVER}:${BUILD_PATH}/Makefile"

## deploy: deploy service
deploy: env
	# @ssh ${SERVER} "make -C ${BUILD_PATH} build"
	# @ssh ${SERVER} "make -C ${BUILD_PATH} publish"
	# @ssh ${SERVER} "make -C ${BUILD_PATH} start"
