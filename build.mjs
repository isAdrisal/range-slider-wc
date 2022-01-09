import esbuild from 'esbuild';
import inlineImportPlugin from 'esbuild-plugin-inline-import';
import sass from 'sass';

const plugins = [
  inlineImportPlugin({
    filter: /^sass:/,
    transform: (contents, args) => {
      const result = sass.compile(args.path, {style: 'compressed'});
      return result.css;
    },
  }),
];

esbuild
  .build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: './dist/index.js',
    format: 'esm',
    target: 'es6',
    minify: true,
    plugins,
  })
  .catch(() => process.exit(1));
