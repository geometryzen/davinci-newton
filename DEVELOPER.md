## Contributing

### Building

Open a terminal window.

Clone the davinci-newton repo:
```
git clone git://github.com/geometryzen/davinci-newton.git
```

Change to the repo directory:
```
cd davinci-newton
```

Install NPM:
```
npm install
npm update --force
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

Install Bower:
```
bower install
bower update
```
to install the software dependencies (For this you need to have [Bower](http://bower.io) installed).

Install JSPM:
```
jspm install
jspm update
```
to install JSPM, used for testing.

Install TypeScript definitions:
```
tsd install
```
to install TypeScript definitions for Jasmine used in testing.

```
grunt
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

## Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## Testing

```
karma start
```

## Versioning

The following files should be changed.

```
src/davinci-newton/config.ts
package.json
bower.json
```

## Deliverables

The following files are created in the `dist` folder.

The following files are in the `UMD` format.

davinci-newton.js
davinci-newton.min.js

The following files are in the `System` format.

davinci-newton-system-es5.js
davinci-newton-system-es5.min.js
davinci-newton-system-es5.js.map

The following files contains the TypeScript type declarations (in a single file).

index.d.ts

## Git

```
git add --all
git commit -m '...'
git tag -a 1.2.3 -m '...'
git push origin master --tags
npm publish
```