### Main Learning Goals

1. Get a better understanding of the heavy lifting done by frameworks.
2. Use https ( lifecycle && cert management )
3. https-cache ( TLS session caching )
4. browser cache ( browser http cache && sw )
5. db queries and optimizations


### Getting started

1. Run web-server 

```
  npm run start
```

2. Run API server

```
npm run api
```


### What it is?
This is a basic notes app, which support CRUD oprations. The rich text editor here is supported by [quilljs](https://quilljs.com/).


### Architecture

The project has two parts one is the web server which hosts the basics of serving assets over https. The other part is the REST API server which basically connects to the database ( postgres ) and serves the data.
