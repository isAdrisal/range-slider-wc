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
  bundle: true,
  format: 'esm',
  minify: !devMode,
  logLevel: 'info',
  plugins,
};

const configTranspiled = {
  ...config,
  target,
  outfile: devMode ? './dev/index.transpiled.js' : './dist/index.transpiled.js',
};

const configModern = {
  ...config,
  outfile: devMode ? './dev/index.js' : './dist/index.js',
};

const build = async () => {
  try {
    const buildFiles = await Promise.all([esbuild.build(configTranspiled), esbuild.build(configModern)]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const serve = async () => {
  const server = await esbuild.serve(
    {
      servedir: './dev',
      onRequest: (r) =>
        console.log(`${r.remoteAddress} - ${chalk.yellow(`"${r.method} ${r.path}"`)} ${r.status} [${r.timeInMS}ms]`),
    },
    configModern
  );
  console.log(`Serving at ${chalk.green(`http://${server.host}:${server.port}`)}`);
};

devMode ? serve() : build();
