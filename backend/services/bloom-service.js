const start = (app) => {
	app.post('/api/receiveData', async (req, res, next) => {
		try {
			if (typeof req.body.bloom_id !== 'number') {
				throw new Error('Missing expected `bloom_id` of type `number` field in request.')
			}
			if (!(req.body.data instanceof Array)) {
				throw new Error(
					'Missing expected `data` field of type `Array` field in request.'
				)
			}
			if (typeof req.body.token !== 'string') {
				throw new Error(
					'Missing expected `token` field of type `string` field in request.'
				)
			}
			if (typeof req.body.signature !== 'string') {
				throw new Error(
					'Missing expected `signature` field of type `string` field in request.'
				)
			}

			// Recover address of wallet that signed the payload
			const qrToken = (req.body.token).trim()
			const bloomData = req.body.data


			const data = {
				qrToken,
				parsedData
			}

			return res.status(200).json({
				success: true,
				token: req.body.token,
				data
			})
		} catch (error) {
			console.log(
				'Encountered an error while receiving data',
				JSON.stringify({
					error,
				})
			)
			next(error)
		}
	})
}

module.exports = {
	start
}