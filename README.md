migrar
=====

Migrate legacy Visualizer apps based on dbx 4 or less to dbx ^20.10

[![Version](https://img.shields.io/npm/v/migrar.svg)](https://npmjs.org/package/migrar)
[![Downloads/week](https://img.shields.io/npm/dw/migrar.svg)](https://npmjs.org/package/migrar)
[![License](https://img.shields.io/npm/l/migrar.svg)](https://github.com/RGkevin/migrar/blob/master/package.json)

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
migrar/3.6.7 darwin-x64 node-v15.4.0
$ migrar --help [COMMAND]
USAGE
  $ migrar COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`migrar controller TO`](#migrar-controller-to)
* [`migrar extensions FROM TO`](#migrar-extensions-from-to)
* [`migrar fix TO NAME`](#migrar-fix-to-name)
* [`migrar form FROM TO NAME`](#migrar-form-from-to-name)
* [`migrar help [COMMAND]`](#migrar-help-command)
* [`migrar modules FROM TO`](#migrar-modules-from-to)
* [`migrar property FROM TO`](#migrar-property-from-to)

## `migrar controller TO`

Fix javascript file

```
USAGE
  $ migrar controller TO

ARGUMENTS
  TO  Controller path to fix

DESCRIPTION
  use the absolute path to the file
```

_See code: [src/commands/controller.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/controller.js)_

## `migrar extensions FROM TO`

Move whole extensions folder from one project to another

```
USAGE
  $ migrar extensions FROM TO

ARGUMENTS
  FROM  Base project path
  TO    Destination project path

OPTIONS
  -p, --epath=epath  [default: mvcextensions] MVC Extensions relative path
```

_See code: [src/commands/extensions.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/extensions.js)_

## `migrar fix TO NAME`

Fix an app component. Use -t to specify the type of component

```
USAGE
  $ migrar fix TO NAME

ARGUMENTS
  TO    Destination project workspace path
  NAME  Form Name

OPTIONS
  -c, --cpath=cpath                  [default: controllers] Controllers library path
  -e, --epath=epath                  [default: modules/require] Controllers extension path
  -f, --fpath=fpath                  (required) [default: forms] Forms path
  -h, --channel=channel              [default: mobile] Platform channel
  -l, --ctrl=ctrl                    [default: Controller] Controllers suffix
  -m, --module=module                [default: AuthModule] Module name
  -o, --apath=apath                  (required) [default: studioactions] Studio Actions path
  -s, --suffix=suffix                [default: BB] Project suffix identifier
  -t, --type=controller|action|form  [default: form] Component type to fix

DESCRIPTION
  Type can be:
  - action
  - form
  - controller
```

_See code: [src/commands/fix.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/fix.js)_

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
  -l, --ctrl=ctrl        [default: Controller] Controllers suffix
  -m, --mname=mname      (required) Module name
  -o, --opath=opath      (required) [default: ~/Visualizer/] Old project workspace path
  -p, --mpath=mpath      [default: mvcextensions] MVC Extensions path
  -r, --format=format    [default: .sm] Folder format suffix
  -s, --suffix=suffix    [default: BB] Project suffix identifier
  -x, --xform            Fix migrated form

DESCRIPTION
  ...
  Please make sure the destination workspace is in a clean git state
```

_See code: [src/commands/form.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/form.js)_

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

## `migrar modules FROM TO`

Move whole modules folder from one project to another

```
USAGE
  $ migrar modules FROM TO

ARGUMENTS
  FROM  Base project path
  TO    Destination project path

OPTIONS
  -p, --mpath=mpath  [default: modules] Modules relative path
```

_See code: [src/commands/modules.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/modules.js)_

## `migrar property FROM TO`

Move actions defined in project properties file

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
```

_See code: [src/commands/property.js](https://github.com/RGkevin/migrar/blob/v3.6.7/src/commands/property.js)_
<!-- commandsstop -->
