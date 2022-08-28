# Moonrise
![](img/p1.png)

A markdown note-taking app demo.

Code name: Moonrise.

**Note:** This demo should not be used in production. It should only be used to gravitate into your next project idea.

# Install

Go to releases and find the latest version available. 

Download the `.dmg` for your platform if you just want to try it out.

**Alternatively:**

Clone the repo

```bash
git clone <SSH/HTTPS link>
```

Change directory

```bash
cd Moonrise
```

Install npm dependencies

```bash
npm install
```

Build app 

```bash
make build
#or 
npm run build
```

Package the app

```bash
make package 
# or
npm run package
#or
make package-arm
#or 
npm run package-arm
```

If you don't need to package, just run Electron in the root directory

```bash
make electron
#or 
npm run electron
```