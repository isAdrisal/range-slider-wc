import browserslist from 'browserslist';
import chalk from 'chalk';
import esbuild from 'esbuild';
import inlineImportPlugin from 'esbuild-plugin-inline-import';
import postcss from 'postcss';
import postcssVariableCompress from 'postcss-variable-compress';
import sass from 'sass';

import resolveTargets from './utils/resolve-targets.mjs';

const mode = process.argv.find((arg) => arg.includes('--mode'))?.split('=')[1];
const devMode = mode === 'dev';

const plugins = [
  inlineImportPlugin({
    filter: /^sass:/,
    transform: async (contents, args) => {
      const compiled = sass.compile(args.path, {style: 'compressed'});
      const output = compiled.css;

      if (devMode) return output;

      const postcssPlugins = [postcssVariableCompress([(name) => !name.startsWith('--_')])];
      const result = await postcss(postcssPlugins).process(output, {from: undefined});
      return result.css;
    },
  }),
];

const target = resolveTargets(browserslist());

const config = {
  entryPoints: ['./src/index.js'],
  outdir: devMode ? './dev' : './dist',
  bundle: true,
  format: 'esm',
  minify: !devMode,
  logLevel: 'info',
  target,
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

devMode ? serve() : build();
