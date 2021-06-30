mvtem
=====

Move temenos apps contents to another temenos app workspace

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mvtem.svg)](https://npmjs.org/package/mvtem)
[![Downloads/week](https://img.shields.io/npm/dw/mvtem.svg)](https://npmjs.org/package/mvtem)
[![License](https://img.shields.io/npm/l/mvtem.svg)](https://github.com/RGkevin/mvtem/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g migrar
$ migrar COMMAND
running command...
$ migrar (-v|--version|version)
migrar/2.0.0 darwin-x64 node-v14.17.0
$ migrar --help [COMMAND]
USAGE
  $ migrar COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`migrar components`](#migrar-components)
* [`migrar dependencies FROM TO`](#migrar-dependencies-from-to)
* [`migrar extensions FROM TO`](#migrar-extensions-from-to)
* [`migrar form FROM TO NAME`](#migrar-form-from-to-name)
* [`migrar help [COMMAND]`](#migrar-help-command)
* [`migrar module FROM TO NAME`](#migrar-module-from-to-name)
* [`migrar modules FROM TO`](#migrar-modules-from-to)
* [`migrar property FROM TO`](#migrar-property-from-to)
* [`migrar templates`](#migrar-templates)

## `migrar components`

Describe the command here

```
USAGE
  $ migrar components

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/components.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/components.js)_

## `migrar dependencies FROM TO`

Describe the command here

```
USAGE
  $ migrar dependencies FROM TO

ARGUMENTS
  FROM  Old project workspace path
  TO    Destination project workspace path

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/dependencies.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/dependencies.js)_

## `migrar extensions FROM TO`

Describe the command here

```
USAGE
  $ migrar extensions FROM TO

ARGUMENTS
  FROM  Base project path
  TO    Destination project path

OPTIONS
  -p, --epath=epath  [default: mvcextensions] MVC Extensions relative path

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/extensions.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/extensions.js)_

## `migrar form FROM TO NAME`

Move a form from old source and paste it in the new workspace as extension

```
USAGE
  $ migrar form FROM TO NAME

ARGUMENTS
  FROM  Base project workspace path
  TO    Destination project workspace path
  NAME  Form Name

OPTIONS
  -a, --actions=actions  [default: Actions] Actions suffix
  -c, --cpath=cpath      [default: controllers] Forms library path
  -e, --epath=epath      [default: modules/require] Controllers extension path
  -f, --fpath=fpath      [default: forms] Forms library path
  -g, --mconfig=mconfig  [default: Config/ModuleConfig.json] Module config relative path
  -h, --channel=channel  [default: mobile] Platform channel
  -m, --mname=mname      (required) Module name
  -o, --opath=opath      (required) [default: ~/Visualizer/] Old project workspace path
  -p, --mpath=mpath      [default: mvcextensions] MVC Extensions path
  -r, --format=format    [default: .sm] Folder format suffix
  -s, --ctrl=ctrl        [default: Controller] Controllers suffix

DESCRIPTION
  ...
  Please make sure the destination workspace is in a clean git state
```

_See code: [src/commands/form.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/form.js)_

## `migrar help [COMMAND]`

display help for migrar

```
USAGE
  $ migrar help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `migrar module FROM TO NAME`

Describe the command here

```
USAGE
  $ migrar module FROM TO NAME

ARGUMENTS
  FROM  Old project workspace path
  TO    Destination project workspace path
  NAME  Form Name

OPTIONS
  -l, --legacy=legacy  Module legacy name. Use if module is not in a parent directory

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/module.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/module.js)_

## `migrar modules FROM TO`

Describe the command here

```
USAGE
  $ migrar modules FROM TO

ARGUMENTS
  FROM  Base project path
  TO    Destination project path

OPTIONS
  -p, --mpath=mpath  [default: modules] Modules relative path

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/modules.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/modules.js)_

## `migrar property FROM TO`

Describe the command here

```
USAGE
  $ migrar property FROM TO

ARGUMENTS
  FROM  Old project workspace path
  TO    Destination project workspace path

OPTIONS
  -f, --fileName=fileName  [default: projectProperties.json] Application Property file name
  -h, --channel=channel    [default: mobile] Platform channel
  -n, --property=property  [default: ide_appEvents] Application Property name to migrate
  -p, --apath=apath        [default: studioactions] Studio Actions path
  -r, --format=format      [default: .json] Files format suffix

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/property.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/property.js)_

## `migrar templates`

Describe the command here

```
USAGE
  $ migrar templates

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/templates.js](https://github.com/RGkevin/migrar/blob/v2.0.0/src/commands/templates.js)_
<!-- commandsstop -->
