# TFE-2021-2022
## OpenTalk App


![Contributors](https://img.shields.io/github/contributors/louisbau/TFE-2021-2022?style=plastic)
![Forks](https://img.shields.io/github/forks/louisbau/TFE-2021-2022)
![Stars](https://img.shields.io/github/stars/louisbau/TFE-2021-2022)
![Licence](https://img.shields.io/github/license/louisbau/TFE-2021-2022)
![Issues](https://img.shields.io/github/issues/louisbau/TFE-2021-2022)

<a href="https://discord.gg/PYGNuba6Zn">
<img alt="Join us on Discord" src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" width="165"/>
</a>

![Logo](https://github.com/louisbau/TFE-2021-2022/blob/main/TFE/assets/images/opentalk_logo.jpg)

## Code of conduct
The code of conduct guidelines : [Code of conduct](https://github.com/louisbau/TFE-2021-2022/blob/main/CODE_OF_CONDUCT.md)

## Contributing
The contribution guidelines : [Contributing](https://github.com/louisbau/TFE-2021-2022/blob/main/CONTRIBUTING.md)

## License
The licence : [MIT](https://github.com/louisbau/TFE-2021-2022/blob/main/LICENSE)


## Installation manual

### Clone the project

    $ git clone https://github.com/louisbau/TFE-2021-2022.git
    $ cd TFE-2021-2022
    $ cd backend
    $ npm install
    $ cd ..
    $ cd TFE
    $ 

### Node js 

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Create .env in the root directory of backend/

    Port=
    HOST=
    USER=
    PASSWORD=
    DB=
    NODE_ENV = 
    TOKEN_SECRET=

## Running the project

    $ npm start
    or
    $ npm run watch
    or
    $ npm test



### React Native Expo

existing app : https://docs.expo.dev/bare/existing-apps/


- #### `npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm start --reset-cache
# or
yarn start --reset-cache
```

- #### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

- #### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

- #### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:


### Docker


- #### Running the project
    $ docker-compose up --build

### Mysql


### Nginx

follow that guideline to make the Https working : https://mindsers.blog/fr/post/configurer-https-nginx-docker-lets-encrypt/



## Documentation


- Expo Doc: https://docs.expo.dev/
- React Native Doc : https://reactnative.dev/docs/getting-started
- React navigation Doc : https://reactnavigation.org/
- Node js Doc : https://nodejs.org/en/docs/
- Apple Review Doc : https://developer.apple.com/app-store/review/
- Mysql Doc : https://dev.mysql.com/doc/
- Docker Doc : https://docs.docker.com/

creator: Louis Bauchau