/* eslint-disable */
// @ts-nocheck
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
	entry: './demo/index.ts',
	context: path.resolve(__dirname),
	stats: 'minimal',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				options: { allowTsInNodeModules: true }
			}
		]
	},
	output: {
		filename: 'main.js',
		publicPath: '/'
	},
	devServer: {
		static: path.join(__dirname, 'dist'),
		open: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			templateContent: `
				<!DOCTYPE html>
				<html lang="en">

					<head>
						<meta charset="UTF-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<script type="module" src="./demo/index.js"></script>
						<title>Demo</title>
					</head>

					<body>
						<lit-slider-demo></lit-slider-demo>
					</body>

				</html>
			`
		}),
	],
	resolve: {
		extensions: ['.ts', '.js']
	}
}

module.exports = (_, args) => {
	if (args.env.test) {
		config.entry = [config.entry, ...Global.sync('./**/*.test.ts').filter(path => path.includes('node_modules') === false)]
		config.devtool = false
		config.path = path.resolve(__dirname, args.env.test ? 'test-temp' : 'dist')
	}
	return config
}