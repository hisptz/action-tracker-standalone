
# STAND-ALONE ACTION TRACKER

[![action-tracker-standalone](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/demzvf/develop&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/demzvf/runs)
[![dhis2: tests](https://github.com/hisptz/action-tracker-standalone/actions/workflows/tests.yml/badge.svg?branch=develop)](https://github.com/hisptz/action-tracker-standalone/actions/workflows/tests.yml)

1.  [Introduction](#Introduction)

2.  [Admin Guide](#Admin)
	
3.  [Developer Guide](#Developer)

    3.1. [Installations](#DevInstallation)



## 1. <a name='Introduction'></a>Introduction

The action tracker is a management tool that helps improve effective coverage of priority interventions at district and community level, covering various interventions such as maternal, newborn, and child health (MNCH), HIV, and nutrition. This process ensures appropriate equity analysis at the sub-national level with the aim of identifying underserved populations and the specific bottlenecks they face in accessing life-saving healthcare. Alongside Bottleneck analysis that analyses hindrances to achieving desired coverage, action tracking allows program implementers to register and track actions based on suggested solutions from root causes, or the ones which are not originating from Bottleneck analysis.

Stand Alone Action tracker is an application developed to operate and installed in DHIS 2 instance, and aimed to operate without the existence of set up Bottleneck Analysis. Stand Alone Action tracker must be installed in DHIS 2 system by user with administrative privilege and configure data entry and report based on in-country needs. Users at sub-national levels will be using action tracker to register actions and track the status of their implementation of tasks based on the roles they are assigned in the application and DHIS 2 system in general. 
The application is developed using DHIS 2 tracker implementation, that gives the possibility of migrating registered actions and their implementations from stand alone action tracker to Bottleneck Analysis (BNA) linked action tracker. Stand Alone Action Tracker differs from BNA linked Action tracker by allowing to set some fields from BNA linked action tracker as optional, that gives possibility of registration and tracking of tasks that are not necessarily obtained from Bottleneck Analysis of interventions.



## 2. <a name='Admin'></a>Admin Guide

### <a name='Installations'></a>Installations

Download the latest version of the App via 

```
https://github.com/hisptz/action-tracker-standalone/releases
```
Go to your DHIS2 instance with the organisation units already in place,then install the downloaded app via App Management

## 3. <a name='Developer'></a>Developer Guide

### 3.1. <a name='DevInstallation'></a>Installations

#### 3.1.1.The DHIS2 CLI installation guide for Linux operating systems.

##### 3.1.1.1.Yarn installation:
```bash
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sourcechh::s.list.d/yarn.list

$ sudo apt update && sudo apt install yarn

# If you are using nvm you can avoid the node installation by running
$ sudo apt update && sudo apt install --no-install-recommends yarn

# To verify yarn installation, run
$ yarn --version
```

##### 3.1.1.2.d2-cli installation:
```bash
$ yarn global add @dhis2/cli

# To verify d2 is installed
$ d2 --help
```
##### NOTE: If the &nbsp;<strong>"d2: command not found"</strong>&nbsp; then run the below commands:
```bash
# Check path to yarn packages
$ yarn global bin

# Add yarn installed packages to path
# Example: export PATH=$PATH:/home/dhis/.yarn/bin 
$ export PATH=$PATH:<path_to_yarn_packages>

# Check if yarn is installed
 $ d2 --help
```
#### 3.1.2.The DHIS2 CLI installation guide for MacOS.

##### 3.1.2.1.Installing d2-app-scripts
```bash
$ yarn global add @dhis2/cli-app-scripts

# To verify d2-app-scripts is installed
$ d2 --help

# Add yarn installed packages to path
$ export PATH=$PATH:<path_to_yarn_packages>

```

##### 3.1.2.2.Bootstrapping
To create a new template application (or upgrade and existing React app), use the d2-app-scripts init command. 

```bash
$ d2-app-scripts init app-name
$ cd app-name

#To start app
$ yarn start
```

##### 3.1.2.3.Proxying to remote server
Local server should whitelist 
localhost:4200 in system settings
<br>
<br>
Chrome
```bash
As of mid-July 2020, the Chrome (and Chromium) stable release channel has started to disable cross-site cookies by default. Mozilla Firefox has pushed this change to their beta channel and will likely release it to the stable channel soon.

# To enable proxying to remote server developer needs to edit SameSite Cookie Attribute when debugging app or developing app

1. Open chrome browser
2. Paste chrome://flags/#same-site-by-default-cookies in address bar
3. Set SameSite Flag to disabled
```

Mozilla
<br>
```bash
Firefox stable channel does not yet enforce this cookie policy, so for the moment everything should continue to work. Currently there doesn’t appear to be an easy way to disable the policy in Firefox Beta.
```

Safari
```bash
To disable SameSite Cookie in Safari:
1. Open Safari 
2. Go to Preferences
3. Navigate to privacy
4. Uncheck “Prevent cross-site tracking” option
```
