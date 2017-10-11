const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getExternals() {
	return fs.readdirSync('node_modules')
		.concat(['react-dom/server'])
		.filter((mod) => mod !== '.bin')
		.reduce((externals, mod) => {
			externals[mod] = `commonjs ${mod}`;
			return externals;
		}, {});
}


module.exports = [
	{
		entry: {
			index: './app/views/client/index.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					// loader: 'style-loader!css-loader',
					loader: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: 'css-loader'
					})
				}
			]
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, './web/bundles/')
		},
		plugins: [
			new ExtractTextPlugin('[name].css')
		],
		watch: true
	},
	{
		entry: {
			index: './app/views/server/index.js'
		},
		target: 'node',
		externals: getExternals(),
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					loader: 'ignore-loader'
				}
			]
		},
		output: {
			filename: '[name].server.js',
			path: path.resolve(__dirname, 'app/views/bundles/'),
			libraryTarget: 'umd'   // if not set require do not work
		},
		watch: true
	}
];

