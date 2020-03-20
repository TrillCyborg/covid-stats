module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
        test: /\.csv$/,
        loader: 'raw-loader',
      })

    return config
  }
}