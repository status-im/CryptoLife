# FLIGHT PLAN - Universal Login

THE OBJECTIVE
At this hackathon we focussed on building integration for Flight Plan's platform to Universal Login.

EXISTING CODE
Flight Plan creates full stack Dapp instances, and we used a use case called Mallow that is currently in POC on our platform.

SUMMARY OF OUTCOME
We have deployed Universal Login to Ropsten Testnet. Based on the Universal Login example dapp, we have created UX patterns that blend heuristcs and popular patterns that users are familiar with from Web2 world and we have applied Web3 specific UX patterns. This recognises the need for adoption focus and lowering the learning curve for new users while surfacing the values and uniqueness of Web3 world (transprency/trust/authenticity/etc) into the user experience.

VISION
Using Universal Login in the Mallow use cases enables a new level of trust in the authenticity for independent fashion designers, coupled with blockchain characteristics around scarcity (limited edition styles) creates a unique and rare garment.
Mallow is one use case heading towards MVP launch on Mainnet with a real garment (beanie called "Incognito"). Integrating with Flight Plan means that other use cases built on our platform can leverage Universal Login

KEY POINTS
We have used Ropsten because it's slow and we need to deal with that UX in an elegant way (which we have through user flow and a toast message). We have used familar UX Patterns such as Google's profile and authentication for the Universal ID, and Amazon's signup for UI. Plus Airbnb's reputation UI to show verification of ENS on the provenance of garments.
BUT we have also blended in some Web3 patterns like ENS and blockies.
There has been a particular focus on copy, aesthetic and information architecture to create a non-intimidating experience that's easy to understand.

SCREENSHOTS
Refer to "Screenshots" directory to see content of overview diagrams of UX design process, user flows and code snippets.

TECHNICAL OVERVIEW
We have looked at utilising code from the Universal Login repository (https://github.com/EthWorks/UniversalLoginSDK) and deployed a set of smart contracts on Ropsten creating the ENS-related Registries, Public Resolver and identity wallet. Code for checking and creating identities were obtained from the universal-login-example sample application provided in the repository, where we utilised the IdentityService interface to trigger the SDK calls for interacting with the smart contracts.

SOME LINKS:
- Ropsten smart contract deployments and transactions - See: https://ropsten.etherscan.io/address/0x2ef6575148d341b225744e75469903e86de82d52
- Ropsten transactions from Mallow use case Dapp triggered by user - See: https://ropsten.etherscan.io/address/0xf0f6c0bdc4d90ff44ed4e73a00200ba67a85e836