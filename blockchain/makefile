.DEFAULT_GOAL := info
.PHONY: info build test

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

###############################################################################
## INFO
###############################################################################

info:
	@echo "Available actions:"
	@echo
	@echo "  $$ run         Runs 'run info' by default"
	@echo "  $$ run info    Shows this text"
	@echo
	@echo "  $$ run styles  Compile the styles"
	@echo "  $$ run media   Arrange images and fonts"
	@echo "  $$ run build   Build your project"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	sudo npm install -g truffle solc ganache-cli
	cd scripts ; npm install

test:
	truffle test

build: 
	solcjs --bin --abi --optimize -o ./build ./contracts/*.sol

deploy: build
	node scripts/deploy
