services-up:
	@docker-compose -f services.yml up

services-down:
	@docker-compose -f services.yml down

services-rm:
	@docker-compose -f services.yml rm

api-build:
	@cd ../api && make build

client-build:
	@cd ../client && make build

api-up:
	@docker-compose -f api.yml up

api-down:
	@docker-compose -f api.yml down

api-rm:
	@docker-compose -f api.yml rm

client-up:
	@docker-compose -f client.yml up

client-down:
	@docker-compose -f client.yml down

client-rm:
	@docker-compose -f client.yml rm
