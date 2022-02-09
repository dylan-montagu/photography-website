App Information

AWS peronsal AIM user sign in url: https://dylan-montagu-aws.signin.aws.amazon.com/console/

- Environmental variables necessary for this Application:
  - AWS_ACCESS_KEY_ID: AWS access key id for personal account
  - AWS_SECRET_KEY: AWS secret key for personal account
  - AWS_BUCKET: AWS bucket that photos are stored in, has to correlate with correct CDN_URL env variable
  - AWS_PREFIX: directory that photos should be stored in on S3. Doesn't matter too much at the moment while this app is only being used for myself
  - CDN_URL: Cloudfront CDN url for AWS_BUCKET
  - MONGO_URI: URI grabbed from mongo atlas website and application to allow server to connect to our Atlast hosted mongo instance
  - PORT: The port that the server is served on. This is only used in production, in dev server defaults to port 5000
- In hosted environment, these are set via `eb setenv` calls.
- Locally, these variables are located in `./server/.env`.
- When switchin between dev and prod instances across the board, have to change:
  - AWS_BUCKET
  - CDN_URL
  - MONGO_URI
  - JWT_TOKEN

Server Information

- process.env.NODE_ENV === "production"

  - When app is 'deployed', want server to serve the static build file of react client
  - Have to pass along the static file with all requests to teh server so that react routing works, becuase it works purely in the router. Otherwise will 'cannot perform GET on /login' and stuff
    - https://stackoverflow.com/questions/51227859/react-router-doesnt-work-on-express-server

- nodemon has some issues

  - THIS WAS SOLVED BY CHANGING FILE NAME TO `server1.js`. FOR SOMEREASON HAVING IT CALLED SERVER WAS CAUSING ISSUES... :shrug
  - some when CTRL+C, the process doesn't actually die and so when start server up again, it'll run into an error due to port conflict
    - solution is to manually receive SIGING signal in ther server and call exit from the server process
  - Sometimes nodemon may restart the server instance before the service it's killing as exited. This can lead to port conflict.
    - Solution is to add a little delay to our server start script for nodemon
  - CTRL+C when running both server and client from base directory using concurrently does not seem to fully work... or it fails more than expected. It's like CTRL+C kills the concurrent process, but neither of the two child proceses it spins up for the Node server nor React dev server.

- Resources
  - Creating a cloudfront distribution from an S3 bucket
    - https://medium.com/tensult/creating-aws-cloudfront-distribution-with-s3-origin-ee47b8122727
  -

Client Information

- Mateiral UI
  - Currenlty using V4 mateiral ui. Still some kinks to work out with making a good theme and stuff. Had a lot of issues when accidentally mixed V4 theme with V5 componeents, and couldn't figure out why nothing was workgin for the longest time. Something to keep an eye on.
- Uploading Images

  - Current implementation kinda follows the method shown in the linked client resource. From what I understand, we initialize a useRef hook, attach that to our input element, and that's how we can access the file that's uploaded to a specific input.

Deploying on Elastic Beanstalk

- Information I've gleaned from working on this for the past day
- Application:
  - This is basically what's defined in .elasticbeanstalk/config.yml.
  - represents the repo, the whole app as a concept
  - initialize by running `eb init`
- Environment:
  - Groupings of resources that an application can be deployed on (dev, prod)
  - To create, run `eb create`. Will have an option on what application to deploy
- Procfile:
  - Determines what script is run when app is deployed. Is entry point to app, like in docker
- package.json

  - start:eb
    - Start script for main app.
      - Downloads dependenceis for clients
      - Builds client into servable artifact.
      - Download server dependencies
      - dev/prod environmental variable set in actual environment
      - so that server will know to get react build artifact, and serve it

- Resources
  - Uploading images from client
    - https://www.pluralsight.com/guides/how-to-use-a-simple-form-submit-with-files-in-react

TODO
- Panoramas shouldn't be mroe than 3x1 aspect ratio. Otherwise it'll cause some weird stuff for the panoramas only portoflio
- Add text to and display text from photos!
- Switch over to the prod resources, and populate/use all of that for the actual live product


admin demo account:
User: admin.demo@gmail.com
Pass: admindemo123456
