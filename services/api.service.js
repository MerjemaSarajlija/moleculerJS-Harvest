"use strict";
const ApiGateway = require('moleculer-web');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { Errors } = require('moleculer');






module.exports = {
	name: "api",
	mixins: [ApiGateway],

	settings: {

		port: config.SERVICES.API.PORT,
		cors: {
			origin: '*',
			methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
			allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
			credentials: false,
			maxAge: 3600
		},
		routes: [
			{
				authorization: true,
				autoAliases: true,
				path: "/api",
				whitelist: [
					'auth.*',
					'project.*',
					'client.*',
					'user.*',
					'company.*',
					'contact.*',
					'expense.*',
					'timesheet.*'
				],
				aliases: {
				},
				bodyParsers: {
					json: true
				}
			}
		],

		assets: {
			folder: 'public'
		},

		onError(req, res, err) { // Global error handler
			res.setHeader('Content-Type', 'application/json; charset=utf-8');
			if (err.code === 'ENOTFOUND') {
				res.writeHead(500);
			} else {
				res.writeHead(err.code || 501);
			}
			let data = err.data || undefined;
			if (err.type === 'VALIDATION_ERROR') {
				data = {
					errors: err.data || undefined
				};
			}
			if (err.code === 'ENOTFOUND') {
				res.end(JSON.stringify({
					success: false,
					message: 'Database connection error. Please try again later.',
					data
				}));
			} else {
				res.end(JSON.stringify({
					success: false,
					message: err.message || undefined,
					data
				}));
			}
		}
	},

	methods: {

		authorize: function (ctx, route, req) {
			const token = this.getTokenFromHeader(req);
			let auth = null;
			let tokenErrorMessage = null;
			if (token) {
				const JWT_PUBLIC_KEY = config.SERVICES.HARVEST.JWT_PUBLIC_KEY;
				jwt.verify(token, JWT_PUBLIC_KEY, function (err, decoded) {
					if (!err) {
						const { ID, EMAIL, ACCESS, COMPANY } = decoded;
						auth = { ID, EMAIL, ACCESS, COMPANY };
						ctx.meta.user = auth;
					} else {
						tokenErrorMessage = err.message;
					}
				});
			}

			if (req.$action && req.$action.auth === 'required') {
				if (tokenErrorMessage === 'jwt expired') {
					return Promise.reject(new Errors.MoleculerError('Unauthorized - JWT token expired', 401));
				}

				if (!token || !auth) {
					return Promise.reject(new Errors.MoleculerError('Unauthorized - No valid access token', 401));
				}
			}

		},

		getTokenFromHeader: function (req) {
			let token = undefined;
			if (req.headers && req.headers.authorization) {
				let type = req.headers.authorization.split(' ')[0];
				if (type === 'Token' || type === 'Bearer')
					token = req.headers.authorization.split(' ')[1];
			}
			return token || req.query.token;
		},
	}
};
