.DEFAULT_GOAL := info
.PHONY: info dev

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
	@echo "  $$ run dev     Start the server with dev env variables"
	@echo

###############################################################################
## RECIPES
###############################################################################

dev: 
	@nodemon server
