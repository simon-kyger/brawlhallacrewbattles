# brawlhallacrewbattle

## Getting Started - DB and Server Setup - Windows7/10:

1. Change the following test if your version of mongodb does not match!!!
2. Also, feel free to make the DB a service, if you're into that kind of stupidity.

##### Determine where to store the data

1. arg1 (before the --dbpath) is the path to your mongo installation. 
2. arg2 (or piped to dbpath) is the place you want to store your data.

Example in a command prompt: 

```
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath "c:\Users\{yourusername}\Desktop\brawlhallacrewbattle\server\data"
```

##### Launch DB

Example in a command prompt:

```
command: "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
```

##### Launching Node With DB:

Example in a command prompt:

```
npm start
```

Verify the server echos back: 
```
Server listening on port: 8080 
Mongodb is listening on port: 27017
```
