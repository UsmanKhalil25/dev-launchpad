const fileContent = `{
  "name": "my-cli",
  "version": "1.0.0",
  "description": "A TypeScript CLI application",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "my-cli": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^22.15.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
}`;

export { fileContent as PACKAGE_JSON };
