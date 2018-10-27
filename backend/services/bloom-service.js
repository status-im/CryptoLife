const Shopper = require('./../models/shopper');

const start = (app, io) => {

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
			const bloomData = req.body.data;

			const personData = {};

			for (let data of bloomData) {
				if (data.target.type == 'email') {
					personData.email = data.target.data;
				}

				if (data.target.type == 'full-name') {
					personData.fullName = data.target.data;
				}
			}

			const data = {
				qrToken,
				personData
			}

			//Add Shopper in DB;
			let createdShopper = await Shopper.create({ firstName: "George", lastName: "Spasov", email: personData.email });
			data.personData.shopperId = createdShopper._id;

			io.emit('message', data);

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