# ----------
# services
# ----------

# up
services-up:
	@docker-compose -f services.yml up

# down
services-down:
	@docker-compose -f services.yml down

# rm
services-rm:
	@docker-compose -f services.yml rm

# ----------
# api
# ----------

# build
api-build:
	@cd ../api && make build

# push
api-push:
	@cd ../api && make push

# pull
api-pull:
	@cd ../api && make pull

# up
api-up:
	@docker-compose -f api.yml up

# down
api-down:
	@docker-compose -f api.yml down

# rm
api-rm:
	@docker-compose -f api.yml rm

# ----------
# client
# ----------

# build
client-build:
	@cd ../client && make build

# push
client-push:
	@cd ../client && make push

# pull
client-pull:
	@cd ../client && make pull

# up
client-up:
	@docker-compose -f client.yml up

# down
client-down:
	@docker-compose -f client.yml down

# rm
client-rm:
	@docker-compose -f client.yml rm
