import esbuild from 'esbuild';
import inlineImportPlugin from 'esbuild-plugin-inline-import';
import sass from 'sass';
import postcss from 'postcss';
import postcssVariableCompress from 'postcss-variable-compress';
import chalk from 'chalk';

const mode = process.argv.find((arg) => arg.includes('--mode'))?.split('=')[1];

const plugins = [
  inlineImportPlugin({
    filter: /^sass:/,
    transform: async (contents, args) => {
      const compiled = sass.compile(args.path, {style: 'compressed'});
      const output = compiled.css;

      if (mode === 'dev') {
        return output.css;
      }

      const postcssPlugins = [postcssVariableCompress([(name) => !name.includes('_')])];
      const result = await postcss(postcssPlugins).process(output, {from: undefined});
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
