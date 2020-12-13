# ----------
# services
# ----------

# up
services-up:
	docker-compose -f services.yml up

# up (daemon)
services-up-d:
	docker-compose -f services.yml up -d

# down
services-down:
	docker-compose -f services.yml down

# rm
services-rm:
	docker-compose -f services.yml rm

# ----------
# api
# ----------

# build
api-build:
	cd ../api && make build

# push
api-push:
	cd ../api && make push

# pull
api-pull:
	cd ../api && make pull

# up
api-up:
	docker-compose -f api.yml up

# up (daemon)
api-up-d:
	docker-compose -f api.yml up -d

# down
api-down:
	docker-compose -f api.yml down

# rm
api-rm:
	docker-compose -f api.yml rm
	docker image rm nick3141/nickkelly.dev-api

# ----------
# client
# ----------

# build
client-build:
	cd ../client && make build

# push
client-push:
	cd ../client && make push

# pull
client-pull:
	cd ../client && make pull

# up
client-up:
	docker-compose -f client.yml up

# up (daemon)
client-up-d:
	docker-compose -f client.yml up -d

# down
client-down:
	docker-compose -f client.yml down

# rm
client-rm:
	docker-compose -f client.yml rm
	docker image rm nick3141/nickkelly.dev-client

# deploy
deploy-docker:
	make api-build
	make client-build
	make api-push
	make client-push

# reload
reload:
	docker stop nk_api
	docker stop nk_client
	docker image rm nick3141/nickkelly.dev-api
	docker image rm nick3141/nickkelly.dev-client
	make api-up-d
	make client-up-d

