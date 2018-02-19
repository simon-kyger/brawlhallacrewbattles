# brawlhallacrewbattle

Hosted @ https://brawlhallacrews.herokuapp.com/

## Getting Started - DB and Server Setup - Windows7/10:

##### Determine where to store the data

1. Create a directory in the PATH, such as /data
2. arg1 (before the --dbpath) is the path to your mongo installation. 
3. arg2 (or piped to dbpath) is the place you want to store your data.

Example in a command prompt *(exchange PATH with the path to your local repository of this project, and change 3.6 to the version of your mongod.exe install)*: 

```
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath "PATH\brawlhallacrewbattle\data"
```

##### Launching Node With DB:

```
node app.js
```

##### Other notes while launching or configuration for Heroku:

There are 4 process.env values that need to be supplied as follows:

```
const serverport = process.env.PORT || 8080;
const dbport = process.env.DBPORT || 27017;
const dbname = process.env.DBNAME || config.get('admin.dbconfig.name') || `brawlhallacrewdb`;
const dburl = process.env.MONGODB_URI || config.get('admin.dbconfig.host') || `mongodb://localhost:${dbport}`;
```

The serverport and dbport dont really matter too much, but the dbname and dburl do.

dburl should be smart enough to run if running the db locally to work. This is basically setting the url path to the database, and if the db is being run locally, the last condition will fire.  if running on heroku, you'll need to set the environment variable in the dashboard.

dbname is a bit tricky because it is utilizing some of mongodb's new client schema. This is basically setting the databases name itself.  If you create your project on heroku, you may be assigned a db name, so in order to get this to work, navigate to the dashboard and create a new environment variable called DBNAME and assign it respectively.

Once again -- If you want to deploy this to heroku, you're going to need to set these environment variables up manually on the destination server!

This will without a doubt require git bash, as well as heroku cli.  See here for more info: https://devcenter.heroku.com/articles/heroku-cli