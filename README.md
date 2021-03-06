[![NPM Package](https://badge.fury.io/js/vio.svg)](https://www.npmjs.com/package/vio)
[![Build Status](https://travis-ci.org/vilic/vio.svg)](https://travis-ci.org/vilic/vio) 
[![Coverage Status](https://coveralls.io/repos/vilic/vio/badge.svg?branch=master&service=github)](https://coveralls.io/github/vilic/vio?branch=master)

# VIO

An [express](http://expressjs.com/) "endware" that takes your feelings into consideration.

## Conversation

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vilic/vio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Why VIO

VIO is a small piece of the greater thing. Rather than a framework, it's more like a light-weight implementation that takes how a maintainable site structure should be like into consideration.

Take the view matching rule as example, it's a balance of how you might wish to put and name view components during design time.

An actual example including suggested file structure **would** introduce extra build steps. Of course it would, as VIO is designed for **real-world** Node.js projects.

It could be something like this:

```text
project
├───bld             # build path.
│   ├───api
│   │   └───routes
│   ├───page
│   │   ├───routes 
│   │   └───views   # contains .hbs files with the same structure as in src.
│   ├───server
│   │       www.js  # entry file.
│   └───static
└───src             # source path.
    ├───api
    │   └───routes
    ├───page
    │   └───routes
    │       │   default.js
    │       └───user
    │               account.js
    │               default.js
    ├───server
    │   │   www.js
    │   ├───models
    │   └───modules
    └───static
        ├───default              # things of one page are in one place.
        │   │   default.hbs
        │   │   default.less
        │   └───images
        └───user
            │   sign-in.hbs
            │   sign-up.hbs
            ├───account
            │       account.hbs  # faster editor navigation with filename.
            └───default
                    user.hbs
```

You may configure tasks using [gulp](http://gulpjs.com/) or other tools.

VIO is developed in [TypeScript](http://www.typescriptlang.org/).
As it's using new ECMAScript features, you will need to use compiler or transpiler like TypeScript or [Babel](https://babeljs.io/).

## Features

- Map routes and controllers based on file paths.
- Support dynamic routes mapping and hot module replacement during development.
- Return a promise with data to render the view.
- Use ES7 decorators to specify route handlers.

Checkout [wiki](https://github.com/vilic/vio/wiki) for examples.

## Install

Install VIO.

```sh
npm install vio --save
```

Install a view engine (here we use [handlebars](http://handlebarsjs.com/) with [consolidate](https://github.com/tj/consolidate.js)). And if you are using TypeScript, install related declarations as well.

```sh
npm install handlebars consolidate --save
tsd install express consolidate
```

Check out [handlebars-layout](https://github.com/vilic/handlebars-layout) if it seems to be something you would want.

## Usage

The following example is in TypeScript. If you are using Babel, the `import` statements will slightly differ. 

**src/server.ts**

```ts
import * as Path from 'path';

import * as express from 'express';
import { handlebars } from 'consolidate';
import { Router } from 'vio';

let app = express();

app.engine('hbs', handlebars);

let router = new Router(app, {
    routesRoot: Path.join(__dirname, 'routes'),
    viewsRoot: Path.join(__dirname, '../views'),
    viewsExtension: '.hbs'
});

app.listen(1337);
```

**src/routes/default.ts**

```ts
import { Controller, get } from 'vio';

// extends `Controller` class.
export default class extends Controller {
    // route as a HTTP GET request.
    @get()
    default() {
        // can also be a promise if it's async.
        return {
            title: 'Hello, VIO!',
            content: 'Keep calm and read the doc!'
        };
    }
}
```

**views/default.hbs**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
</head>
<body>
    <h1>{{title}}</h1>
    <p>{{content}}</p>
</body>
</html>
```

Now compile files in `src` into `bld` and run `node bld/server.js` to start the server.

Please checkout [demos](https://github.com/vilic/vio-demos) for more usage.

## Dynamic Loading

The previous version of VIO is used internally in the passed half a year, having handled more than 100 million page views (though it does not mean you can use this version in production). And the biggest issue this version of VIO wants to take out is slow restarting of node process when something changes. It's not a big deal if the code base is small, but when things grow, it would drive people crazy.

Comparing to other hot module replacement implementation (usually by intercepting `require` mechanism), VIO take things a little bit further. As routes are file path based (which means no manually mapping needed), VIO guess the possible paths based on requesting url and then load the route file on demand. And of course creating, moving, deleting route files would work without restarting node.

## Route Matching

The route path is a combination of route file path (relative path to `routesRoot`) and route path (implied by route method name using [hyphenate](https://github.com/vilic/hyphenate)).

The last `default` of route file path or route method name, as well as the last part in file path if it's the same as the containing folder name, will be ignored. For example:

Route handler `default` defined in `desktop/default.js` file will be matched with route path `/desktop` instead of `/desktop/default` or `/desktop/default/default`.

And if you specified default subsite as `desktop`, it will match both `/` and `/desktop`.

## View Matching

Taking a better editor navigation experience and file structure into consideration, view matching accepts more patterns. For example, route path `/hello/world` would accept view file (take `.hbs` here) at these paths:

- `/hello/world.hbs`
- `/hello/world/default.hbs`
- `/hello/world/default/default.hbs`
- `/hello/world/world.hbs`
- `/hello/world/default/world.hbs`

## Production Mode

Unlike development mode with dynamic loading, production mode loads all routes when process starts and will not care about file changes.

To enable production mode for testing purpose, set environment variable `NODE_ENV` to `"production"`.

## License

MIT License.
