const path = require('path')
module.exports = {
   entry: path.join(__dirname, 'src', 'crypto_will.js'), // src gets webpacked into public/js for client
   output: {
      path: path.join(__dirname, 'public/js'),
      filename: 'build.js' // The final file will be created in public/js/build.js
   },
   module: {
      rules: [{
         test: /\.css$/, // To load the css in react
         use: [{loader:'style-loader'},{loader: 'css-loader', options:{modules:true}}],
         include: '/public/css/'
      },
      {
        test: /\.json$/,
        use: [{loader:'json-loader'},{loader: 'json', options:{modules:true}}],
        include: '/public/js/'
      }]
   }
}

