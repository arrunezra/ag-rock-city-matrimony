
module.exports = {
  presets: ['@react-native/babel-preset', "nativewind/babel"],
  plugins: [
   
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
          'src': './src',
          'assets': './assets',
          'tailwind.config': './tailwind.config.js',
        },
      },
    ],
    'react-native-reanimated/plugin', // Ensure this is always LAST
  ],
};