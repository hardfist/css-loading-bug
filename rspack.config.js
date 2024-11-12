const path = require('path');

const rspack = require('@rspack/core');

const resolveApp = (relativePath) => path.resolve(__dirname, relativePath);

const isDev = false;
const publicPath = '/';

/** @type {import('@rspack/cli').Configuration} */
const config = {
  mode: process.env.NODE_ENV,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath,
    filename: isDev
      ? 'static/js/[name].js'
      : 'static/js/[name].[contenthash:8].js',
    chunkFilename: isDev
      ? 'static/js/[name].chunk.js'
      : 'static/js/[name].[chunkhash:8].chunk.js',
    cssFilename: isDev
      ? 'static/css/[name].css'
      : 'static/css/[name].[contenthash:9].css',
    cssChunkFilename: isDev
      ? 'static/css/[name].chunk.css'
      : 'static/css/[name].[contenthash:9].chunk.css',
    assetModuleFilename: isDev
      ? 'static/media/[name].[ext]'
      : 'static/media/[name].[hash:8].[ext]',
  },
  experiments: {
    css: true,
  },
  devServer: {
    host: '127.0.0.1',
    port: 26386,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  optimization:{
    minimize:false
  },
  resolve: {
    // tsConfig: {
    //   configFile: path.resolve(__dirname, 'tsconfig.json'),
    // },
    modules: ['node_modules'].filter(Boolean),
    extensions: ['...', '.js', '.ts', '.tsx', '.jsx'],
  },
  resolveLoader: {
    modules: ['node_modules'].filter(Boolean),
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      publicPath,
      inject: 'head',
    }),
    new rspack.ProgressPlugin(),
  ],
  module: {
    parser: {
      'css/auto': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            /**
             * @type {import('@rspack/core').SwcLoaderOptions}
             */
            options: {
              sourceMaps: true,
              // module: {
              //   type: 'es6',
              //   noInterop: true
              // },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  exportDefaultFrom: true,
                  exportNamespaceFrom: true,
                  jsx: true,
                  decorators: true,
                },
                externalHelpers: true,
                preserveAllComments: false,
                transform: {
                  react: {
                    runtime: 'automatic',
                    throwIfNamespace: true,
                    useBuiltins: false,
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules(?!\/@pdd\/monitor\/)/,
        use: {
          loader: 'builtin:swc-loader',
          /**
           * @type {import('@rspack/core').SwcLoaderOptions}
           */
          options: {
            // Enable source map
            sourceMap: true,
            target: 'es5',
            // module: {
            //   // noInterop: true,
            //   type: 'commonjs'
            // },
            jsc: {
              loose: true,
              parser: {
                syntax: 'ecmascript',
                // exportDefaultFrom: true,
                // exportNamespaceFrom: true,
                jsx: true,
                tsx: true,
                decorators: true,
              },
              externalHelpers: true,
              preserveAllComments: false,
              transform: {
                react: {
                  runtime: 'automatic',
                  pragma: 'React.createElement',
                  pragmaFrag: 'React.Fragment',
                  throwIfNamespace: true,
                  useBuiltins: false,
                },
              },
              // experimental: {
              //   plugins: [
              //     [
              //       '@swc/plugin-remove-console',
              //       {
              //         exclude: ['error']
              //       }
              //     ]
              //   ]
              // }
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {},
            },
          },
        ],
        type: 'css/auto',
      },
      // {
      //   test: /\.css$/,
      //   use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
      //   type: 'css/auto',
      // },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              includePaths: [
                path.join(resolveApp('src'), 'scss'),
                resolveApp('node_modules'),
              ],
            },
          },
        ],
        type: 'css/auto',
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: false,
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = config;
