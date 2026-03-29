export default {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.json': ['prettier --write'],
  '*.sol': ['prettier --write --plugin=prettier-plugin-solidity'],
};
