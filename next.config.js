const path = require("path")
const withImages = require('next-images')

module.exports = {
  reactStrictMode: false,
  webpack5: false,
  
  resolve: {
    extensions: ['.js', '.jsx']
  }
}

module.exports = withImages()
