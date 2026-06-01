module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@react-three/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@react-three'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': ['error', { ignore: ['attach', 'args', 'intensity', 'position', 'castShadow', 'receiveShadow', 'geometry', 'material', 'object'] }],
  },
  overrides: [
    {
      // R3F intrinsics (<meshPhysicalMaterial>, <bufferAttribute>, etc.) expose
      // hundreds of three.js props that eslint-plugin-react can't validate.
      // Disable the host-prop check for the 3D layer only; DOM checking stays on
      // everywhere else.
      files: ['src/three/**/*.{js,jsx}'],
      rules: { 'react/no-unknown-property': 'off' },
    },
  ],
}
