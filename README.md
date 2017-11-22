# dataviz-streamgraph-explorer

An interactive visualization system for exploring flow timeseries data (work in progress).

You can try it out here: https://unhcr.github.io/dataviz-streamgraph-explorer/

## Development

This project uses NPM and Webpack. To get started, clone the repository and install dependencies like this:

```
cd dataviz-streamgraph-explorer
npm install
```

You'll need to build the JavaScript bundle using WebPack, using this command:

```
npm run build
```

To see the page run, you'll need to serve the site using a local HTTP server.

```
npm install -g http-server
http-server
```

Now the site should be available at localhost:8080.

## Deployment

We are using GitHub pages to deploy this project to the Web. Deployments are manual, and require the following steps:

```
git checkout master
git pull
git checkout gh-pages
git merge master
npm run build
git status -s # You should see that only build.js has been changed.
git add .
git branch # Make sure you're on the gh-pages branch.
git commit -m "Deploy the latest" -a
git push
```
