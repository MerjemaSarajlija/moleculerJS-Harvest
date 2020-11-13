const { Errors } = require('moleculer');

module.exports = function () {
	return {
		methods: {
			returnPaginatedList({ message, items, itemsName, page, pageSize, total }) {
				return {
					success: true,
					message: message || 'List of items',
					data: {
						[itemsName || 'items']: items,
						pagination: {
							total,
							page,
							pageSize,
							totalPages: total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
						}
					}
				};
			},

			restSuccessResponse(message, data) {
				return {
					success: true,
					message,
					data
				};
			},
			restNotFoundResponse(name) {
				return Promise.reject(new Errors.MoleculerError(`${name} does not exist.`, 404));
			},
			restAlreadyExistsResponse(field) {
				return Promise.reject(new Errors.MoleculerClientError(`${field} is already taken`, 422, '', { errors: [{ field: field, type: 'Already taken', message: `${field} is already taken` }] }));
			},
			cannotDeleteSelfResponse() {
				return Promise.reject(new Errors.MoleculerError('You can not delete yourself!', 422));
			},
			validationErrorFirstDate() {
				return Promise.reject(new Errors.MoleculerError(
					'Parameters validation error!',
					422,
					'VALIDATION_ERROR',
					[
						{
							type: 'required',
							field: 'periodFirstDate',
							message: 'The \'periodFirstDate\' must be date and can only be 1st or 16th day of the month!'
						}
					]
				));
			},
		},
	};
};