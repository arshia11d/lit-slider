/* eslint-disable no-undef */
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	pluginss: [
		[
			'snowpack-plugin-css-result',
			{
				include: 'node_modules/swiper/**'
			}
		]
	],
	devOptions: {
		open: undefined
	}
}