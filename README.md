# Redwood Local JWT Auth Skeleton

> **WARNING:** RedwoodJS software has not reached a stable version 1.0 and should not be considered suitable for production use. In the "make it work; make it right; make it fast" paradigm, Redwood is in the later stages of the "make it work" phase.

## Getting Started
This is a skeleton project including a local auth client based on JWT for those that do not wish to integrate with a 3rd party service.


## Setup

We use Yarn as our package manager. To get the dependencies installed, just do this in the root directory:

```terminal
yarn install
```


Initiate the database with the pre-defined models in order to use the local auth service
```terminal
yarn rw db up
```

### Optional
Populate your database with a pre-defined Admin user (Change default values at /api/prisma/seeds.js)
```terminal
yarn rw db seed
```


### Fire it up

```terminal
yarn redwood dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.
