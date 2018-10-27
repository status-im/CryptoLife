.DEFAULT_GOAL := info
.PHONY: info build

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
	@echo "  $$ run init    Install dependencies"
	@echo "  $$ run build   Compile assets"
	@echo "  $$ run dev     Debug locally"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	@if [ -x $(which sudo) ] ;\
  then sudo npm i -g parcel-bundler ;\
  else npm i -g parcel-bundler ;\
  fi
	yarn || npm i

build:
	@echo "Cleaning the build folder"
	rm ./build/*
	@echo "Bundling the web site"
	NODE_ENV=production parcel build -d ./build --log-level 2 --no-source-maps --public-url ./ src/index.html

www:
	build
	serve build -p 1234

dev:
	echo "Running on the ropsten blockchain"
	NODE_ENV=development parcel -d ./build src/index.html
