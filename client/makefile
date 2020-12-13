# https://blog.container-solutions.com/tagging-docker-images-the-right-way
NAME		:= nick3141/nickkelly.dev-client
# tag as git commit:
# TAG 		:= $$(git log -1 --pretty=%h)
# tag as package.json version:
# https://gist.github.com/DarrenN/8c6a5b969481725a4413
TAG 		:= $$(cat package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
IMG			:= ${NAME}:${TAG}
LATEST	:= ${NAME}:latest

echo-tag:
	echo ${TAG}

build:
	docker build -t ${IMG} .
	docker tag ${IMG} ${LATEST}

build-no-cache:
	docker build --no-cache=true -t ${IMG} .
	docker tag ${IMG} ${LATEST}

rm-image:
	docker image rm ${NAME}

push:
	docker push ${NAME}

pull:
	docker pull ${NAME}

login:
	docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}
