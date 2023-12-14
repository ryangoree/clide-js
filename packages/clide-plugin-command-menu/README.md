# Clide-JS Command Menu Plugin

A [Clide-JS](https://github.com/ryangoree/clide-js/tree/main) plugin that prompts the user to select a subcommand when required.

```ts
import { run } = from 'clide-js';
import { commandMenu } = from 'clide-plugin-command-menu';

run({
  plugins: [
    commandMenu({
      title: 'Foo CLI',
      titleColors: ['#D89DFF', '#519BFF'],
    })
  ],
});
```

![Title menu](https://raw.githubusercontent.com/ryangoree/clide-js/main/packages/clide-plugin-command-menu/assets/opening-menu.png)

After the user selects a subcommand, the command will be resolved and if it
also requires a subcommand, the user will be prompted again, but this time
can also select `↩ back` to go back to the previous menu. This will continue
until the user has selected all required subcommands.

![Submenu](https://raw.githubusercontent.com/ryangoree/clide-js/main/packages/clide-plugin-command-menu/assets/submenu.png)

## Installation

```sh
npm install clide-plugin-command-menu
# or
yarn add clide-plugin-command-menu
```
