import esbuild from 'esbuild';
import inlineImportPlugin from 'esbuild-plugin-inline-import';
import sass from 'sass';
import chalk from 'chalk';

const mode = process.argv.find((arg) => arg.includes('--mode'))?.split('=')[1];

const plugins = [
  inlineImportPlugin({
    filter: /^sass:/,
    transform: (contents, args) => {
      const result = sass.compile(args.path, {style: 'compressed'});
      return result.css;
    },
  }),
];

const config = {
  entryPoints: ['./src/index.js'],
  outdir: mode === 'dev' ? './dev' : './dist/',
  bundle: true,
  format: 'esm',
  target: 'es6',
  minify: mode !== 'dev',
  logLevel: 'info',
  plugins,
};

const build = () => esbuild.build(config).catch(() => process.exit(1));

const serve = async () => {
  const server = await esbuild.serve(
    {
      servedir: './dev',
      onRequest: (r) =>
        console.log(`${r.remoteAddress} - ${chalk.yellow(`"${r.method} ${r.path}"`)} ${r.status} [${r.timeInMS}ms]`),
    },
    config
  );
  console.log(`Serving at ${chalk.green(`http://${server.host}:${server.port}`)}`);
};

mode === 'dev' ? serve() : build();
