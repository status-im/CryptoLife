all:
	cd eth/; \
	truffle compile; \
	cat build/contracts/Synestic.json | jq .abi -rc; \
