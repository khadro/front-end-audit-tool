const pkg = require('./../package.json');
const path = require("path");

const cwd = process.cwd();
const pkgName = pkg.name;

const folder = {
  app: "assets",
  dist: "dist",
  js: "js",
  css: "css",
  scss: "scss",
  images: "images",
  fonts: "fonts",
  profiles: "profiles",
}

/*
  Use the following to control your output files.
  Files will use the format [files.ns]-[files.js.main].js
*/
const files = {
  name: pkg.name,
  ns: pkg.namespace,
  js: {
    main: 'main',
    bundle: 'bundle',
  },
  css: {
    main: 'main'
  }
}

const paths = {
  dist: path.resolve(cwd, folder.dist),
  test: path.resolve(cwd, folder.app, folder.js, "_tests"),
  profiles: path.resolve(cwd, folder.profiles),
  html: {
    in: path.resolve(cwd, folder.app, "pages", "index.html"),
    out: "index.html",
  },
  fonts: {
    in: `./${folder.app}/${folder.fonts}`,
    out: `./${folder.fonts}`,
  },
  scripts: {
    in: path.resolve(cwd, folder.app, folder.js),
    out: path.resolve(cwd, folder.dist, folder.js),
    // some webpack plugins only work from /dist and need a relative path.
    relative: "js",
    // if you need to move files from the default output that we can't always override, set this to something other than the standard location
    move: path.resolve(cwd, folder.dist, folder.js),
    // for wordpress sites that seem to like to parse all their URLS through plugins, causing dynamic imports to break, we can use an absolute path like this.
    // pkg.shortname is stored in package.json, and should be set to the name of the theme you are building for the WP project.
    modules: `/wp-content/themes/${pkg.shortname}/source/dist/`
    // for all others, we can use auto, because they can't count their IQ on their fingers.
    // modules: 'auto'
  },
  css: {
    in: path.resolve(cwd, folder.app, folder.scss),
    out: path.resolve(cwd, folder.dist),
    // if you need to move files from the default output that we can't always override, set this to something other than the standard location
    move: path.resolve(cwd, folder.dist),
  },
  images: {
    in: `./${folder.app}/${folder.images}`,
    out: `./${folder.images}`,
  },
  favicon: {
    in: `./${folder.app}/${folder.images}/logo.png`,
    out: path.resolve(cwd, folder.dist, folder.images, "favicon"),
  },
};

// the following elements are defined outside the main definition as they require the use
// of previous objects in the main listing.
paths.scripts.out = path.resolve(paths.dist, paths.scripts.relative),
paths.exclude = [paths.test, paths.scripts.in];
paths.watchIgnore = [paths.dist, paths.scripts.in, paths.test];
paths.libraries = {
  js: path.resolve(paths.scripts.out, "libraries"),
  css: path.resolve(paths.css.out, "libraries"),
};

/*
We can add our desired third party libraries to the webpack build, and have them output as discrete files in the libFolder, so that they can be called dynamically on demand when they are required on certain pages. This is used as config for the CopyWebpack plugin.

using `require.resolve("packageName")` will resolve to the relative path of an npm package.

using `"relative/path/to/file.ext"` or preferably `path.resolve(cwd, "path", "to", "file.ext")` which is cross-browser safe, will include a file from our local tree (if something is not available via NPM, or is a custom script that needs to be dynamically available).

Yes, the below is messy AF, but it's realistically writing direct webpack configuration, rather than abstracting it out to something readable.
*/
const libraries = [
  {
    from: require.resolve("@splidejs/splide"),
    to: paths.libraries.js,
  },
  { from: require.resolve("a11y-dialog"), to: paths.libraries.js },
  {
    from: `${path.dirname(
      require.resolve("@fortawesome/fontawesome-free")
    )}/brands.min.js`,
    to() {
      return `${paths.libraries.js}/fontawesome-[name].[ext]`;
    },
    info: { minimized: true },
  },
  {
    from: `${path.dirname(
      require.resolve("@fortawesome/fontawesome-free")
    )}/regular.min.js`,
    to() {
      return `${paths.libraries.js}/fontawesome-[name].[ext]`;
    },
    info: { minimized: true },
  },
  {
    from: `${path.dirname(
      require.resolve("@fortawesome/fontawesome-free")
    )}/fontawesome.min.js`,
    to: paths.libraries.js,
    info: { minimized: true },
  },
  // below is an example of including an already minified file. We pass the minified: true flag so it is not passed through the terser plugin to be reminified, for performance reasons.
  {
    from: require.resolve("body-scroll-lock"),
    to: paths.libraries.js,
    info: { minimized: true },
  },
  // below is an example of an exact link to a file in a node_modules or similar directory. You will need to know the path to the correct file. In this case the main file was index.js and simply importing the other file
  {
    from: `${path.dirname(
      require.resolve("intl-tel-input")
    )}/build/js/intlTelInput.min.js`,
    to: paths.libraries.js,
    info: { minimized: true },
  },
  // below is an example of redirecting to an explicitly named file. utils.js was not sufficiently unique for our requirements, so we renamed it to the parent JS and appended the implicit name and extension to the end.
  {
    from: `${path.dirname(
      require.resolve("intl-tel-input")
    )}/build/js/utils.js`,
    to() {
      return `${paths.libraries.js}/intlTelInput.[name].[ext]`;
    },
  },
  { from: require.resolve("pristinejs"), to: paths.libraries.js },
];


function generateTimestamp() {
  // generate a timestamp for labelling of profile/reports.
  // we could use this for the build date, but it's less readable for users who may want to simply know when the file was created.
  const lead = (val) => `0${val}`.slice(-2);
  const date_ob = new Date();
  const date = lead(date_ob.getDate());
  const month = lead(date_ob.getMonth() + 1);
  const year = date_ob.getFullYear();
  const hours = lead(date_ob.getHours());
  const minutes = lead(date_ob.getMinutes());
  const seconds = lead(date_ob.getSeconds());
  return `${year}${month}${date}-${hours}${minutes}${seconds}`;
}

// the queries below must be exact. Using "screen and (min-width: NNNpx)" is not the same as using "(min-width: NNNpx)"
const mediaCSSExtractQueries = {
  "(min-width: 500px)": "sm",
  "(min-width: 720px)": "md",
  "(min-width: 940px)": "lg",
  "(min-width: 1280px)": "xl",
  "(min-width:500px)": "sm",
  "(min-width:720px)": "md",
  "(min-width:940px)": "lg",
  "(min-width:1280px)": "xl"
}

const critical = {
  sizes: [
    {
      height: 812,
      width: 375,
    },
    {
      height: 768,
      width: 1024,
    }
  ],
  // this is the page that will be used to generate the critical CSS
  // url: "http://local.llaweb.sitback.com.au/"
}

// turn plugins on and off from here.
const pluginOpts = {
  banner: true, // adds a banner with file info and build date to output files.
  critical: false, // generates a critical-path css. Requires critical const above to be populated.
  cleanWebpack: true, // cleans dist folder each time you run a build.
  compress: true, // compresses the output of CSS and JS files into brotli and gzip versions
  eslint: true, // runs linting on the JS output
  favicon: true, // generates a favicon from a single source into multiple sizes in common use
  fileManager: true, // copies files from the standard dist folder to a folder of your choice
  htmlwebpack: false, // generates static html with resource replacement from a set of templates.
  lighthouse: false, // runs a lighthouse test against output files. Note: not yet configured.
  mediaQuery: true, // breaks standard output CSS into breakpoint-based filenames to allow staggered loading
  miniCSSExtract: true, // this should always be on, unless you don't need to generate CSS for your project.
  profiling: false, // runs and records a profile of the webpack build so you can track builds over time. Not recommended, very slow and perhaps of limited use.
  watchIgnore: true, // lets you exclude certain files from being watched while building.
}


module.exports = {
  compressRule: /\.(js|css|svg)$/,
  bannerString: `Project: ${pkg.name} - ${pkg.version}
File: [file]
Build: ${new Date()}`,
  timestamp: generateTimestamp(),
  paths,
  pluginOpts,
  files,
  folder,
  libraries,
  mediaCSSExtractQueries,
  critical, //needs to have a live site to check against, for now.
  pkgName,
};
