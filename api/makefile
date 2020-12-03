# https://blog.container-solutions.com/tagging-docker-images-the-right-way
NAME		:= nick3141/nickkelly.dev-api
# TAG 		:= $$(git log -1 --pretty=%!H(MISSING))
TAG 		:= $$(git log -1 --pretty=%h)
IMG			:= ${NAME}:${TAG}
LATEST	:= ${NAME}:latest

build:
	@docker build -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

build-no-cache:
	@docker build --no-cache=true -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

push:
	@docker push ${NAME}

pull:
	@docker pull ${NAME}

login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}

# production-up:
# 	@docker-compose --env-file .env.prod up -d
