/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-preset-env': {},
    'postcss-import': {},
    'postcss-preset-env': {
      'features': { 
        'nesting-rules': false
      }
    },
    'autoprefixer': {}
  }
};

export default config;
