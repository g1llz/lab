// TODO: this file does not check yet if the error comes to checkout or recurring-payment. implement that!
const errors = require('./errors-checkout')

function PagseguroError(e) {

	Error.captureStackTrace(this, this.constructor)
	this.name = 'PagseguroError'

	this.status = e.status || 'error'
	this.statusCode = e.statusCode || 500
	this.content = e.content || null

	if (e.content) {

		const localeError = (error) => {
			return {
				...error,
				message: errors[error.code] || error.message
			}
		}

		if (Array.isArray(e.content)) {
			this.content = e.content.map(localeError)
		} else if (e.content.code){
			this.content = [localeError(e.content)]
		}
	}

}

module.exports = PagseguroError
