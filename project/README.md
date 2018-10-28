Meeseeks.app
============

IPFS Storage with its *own* Origin.


About
-----

The goal of *meeseeks.app* is to enable applications to be **hosted** and
**served** from IPFS, while keeping all the security policies browsers
have established in tact, such as:

- window.localStorage
- Cookies
- Status/MetaMask permissions
- Remote connection policies (e.g. JSON fetch)


How?
----

All pages on *.meeseeks.app point to a single CDN instance, which serves a
single HTML static page.

When visiting pac-txt.meeseeks.app, for example, the page:

1. Converts *pac-txt.meeseeks.app* to **pac-txt.eth**
2. Resolves the **vnd.app.meeseeks** text key from ENS for a IPFS *multihash*
3. Fetches all the blocks from IPFS for the content and verifies the content hashes match.
4. Using `document.open()`, replaces itself (the static HTML file) with the contents from IPFS

The original document no longer exists, and the content from IPFS is (at run-time) actually
being hosted on *pac-txt.meeseeks.app*, and therefore has all the security policies in place
for its domain, *pac-txt.meeseeks.app*.


Presentation slides
-------------------

[![Meeseeks.app Presentation Slides](https://img.youtube.com/vi/y_Z2CtQolbY/0.jpg)](https://www.youtube.com/watch?v=y_Z2CtQolbY)

Demos
-----

**Demo #1: A normal website, hosted from IPFS**

https://pac-txt.meeseeks.app


**Demo #2: An example of "the problem":**

These two dapps both access the localStorage value `count` and increment it. They also
both access the web3.currentProvider.enable(), to demonstrate "granting permission"
leaks from dapp to dapp.

To reproduce the issue:

1. In Status (or any other dapp browser), open https://ipfs.io/ipfs/QmaSYs34hZk8tzisfLEp5WVz4c4tuEdF9K4ykES2cF6ag4
2. Refresh the page 5-10 times
3. Now load: https://ipfs.io/ipfs/QmcoyyhEKddkc7XG6cd5dewstBymF57ToB4Z4VVCbSJU8n
4. Notice the `count` variable is shared between them, so the value in step 3 starts off where you left off from step 2 (from the dapp in step 1).

Now compate to meeseeks.app:

1. In Status (or any other dapp browser), open https://peeping.meeseeks.app
2. First notice, the count starts at 0.
3. Refresh the page 5-10 times
4. Now load: https://wiretap.meeseeks.app
5. Notice this app also starts at 0, **not** continuing from where you left off in step 3.


To Do
-----

The file is currently VERY large, we expect to get the bootstrap HTML file
down to around 5-12kb, making it quite feasible for us to host a large number of
dapps.

Simplified ENS code will query both INFURA and Etherscan, which must BOTH agree to
reduce the risk of ENS spoofing. The ethers attested response backend will
be added too.

A CLI command to serve a local instance of the bootstrap HTML, loading an unpublished
site.


License
-------

MIT License.
