# brawlhallacrewbattle

## Getting Started - DB and Server Setup - Windows7/10:

Change the following test if your version of mongodb does not match!!!
Also, feel free to make the DB a service, if you're into that kind of stupidity.

1. Determine where to store the data
arg1 is the path to your mongo installation. arg2 (or piped to dbpath) is the place you want to store your data.
command: "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath "c:\Users\{yourusername}\Desktop\brawlhallacrewbattle\server\data"

2. Launch DB
open new command prompt
command: "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"

3. To run server with db in tandem
open new command prompt
command: npm start
verify the following message: Server listening on port: 8080 Mongodb is listening on port: 270172