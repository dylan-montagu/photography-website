# Dylan Montagu Photography | dylanmontagu.com

WORK IN PROGRESS


## Intro
I've wanted to gain experience and learn more frontend and JS/React for a while. I decided to create a website to share my photographs to appease this desire as well as my mother's demands that I share all of my photographs her. 

This applicaiton is built on a MERN stack (MongoDB, Express, React, Node). Photos are hosted on S3 and accessed via AWS's CDN Cloudfront. THe whole application is currenlty deployed, hosted, and maintined via AWS Elastic Beanstalk. 


## The Backend

#### Database
I chose MongoDB for my persisence layer for many reasons. Firstly - MongoDB Atlas provides a cloud hosted DB service that was easy to set up and link a server to. Not having to manage a database, as well as having one less service I'd have to maintain was a huge selling point of this service. Secondly - MongoDB Atlas has a free tier service (woohoo). Thirdly - a schemaless DB allowed me the freedom to easily 'mess around' as I developed my applicaiton without any clear vision of what I ultimately wanted it to look like.

#### Image Stoarage
Initially, AWS S3 was chosen for image storage due to a desire to have all images saved in a private bucket, accessible only through presigend-URLs served by the server to the front end. Initial iterations of the applicaiton implemented this, limited access to all photos to only authorized users. While this functionality was great as it allowed me to upload personal photos go share with only family and friends, my desires for the applicaiton eventually changed to wanting to create a method to share my photographs to the public, accessible to anyone. Upon deciding on this change, it was an easy and logical next step to front my S3 images with CloudFront, allowing storage and caching closer to end users around the world (my primary audience outside of the U.S. being my grandparents in Vietnam). 

#### Development Process
The backend express API was the first part of this application to be developed. All photo and album endpoints were initially defined. As app developement progressed, user roles were defined and JWT-authentication was added for all write endpoints related to photo or album manipulation. 

As I began to integrate the backend and frontend together, I began to see significant performance decreases when viewing large albums due to large image sizes. I deteremined I needed to implement server side image resizing. After much playign around with different compression amounts and comparing image quality, I ended up with four resized image configuratinos that worked well with my lightroom-exported photo specs. Having a variety of images sizes to work with (thumbnail, small, medium, and fullsize) allowed to optimze image quality against user experience and image loading times. 


## The Frontend

#### Frontend Framework/Library
My vision for displaying photographs was a responsive image gallery that provided dynamic tiling of many photographs with a range of differetn aspect ratios. I found several great solutions based off of Angular, however ultimatley decided to to with React due to it's increased popularity and prevalence (it's worth noting that if I were to do this project over now, I would consider both Svelte and Vue in addition to React). 

#### Image Display
react-photo-gallery was chosen for its effective dynamic responsive photo tiling implementation. Although I occasionally experience issues with displaying images such as panoramos with aspect ratios over 1:3, this library has worked as desired for all other instances. 

Although image 'lightboxes' that dim the page and show a larger version of a clicked on image are a great tool, I was unabel to find a library that did what I wanted. My current solution of having a user being taken to a new route is a temporary measure while I work on creating my own lighbox implementation. 

#### Development Process
With the primary focus of this applicaition being around sharing photorpahs, frontend development was done with the intention of a minimalistic interface that focused on the images. White background with black lettering provided a neutral, clean look that neither detracted nor added too much 'noise' to the presentation of the images. 

Implementing slight image zoom and highlighting on hover provided a subtle way of shwoing what image a user was about to select. This effect in addition to album name darkeing during album navigation provided the minimalistic effect I was looking for. 

Componenet/text resizing was somethign I wanted to have a base implementation of in order to provide a good UI whether the website was accessed from a phone or full screen monitor. While the current implementation addresses most componenets such as the navigation bar, there still remain some componenets that need to be addressed such as album name displaoys on small screens. 

Having created an appealing interface for end users, the next step was to create a thorough admin page for myself. Up until this point, I had uploaded, rearranged, and deleted images and alubms by directly calling the backend API. Tying these actions to an interface that allowed actions such as drag-n-drop for rearragnign photos as well as creating new albums was straight-forward at an indivudal process levle, however displayoing all the possible actions that I needed to perform in a manner that was logical and not too busy of a console was difficult. The current admin page is a current work in progress as far as 'user experience' and streamlining an admin work flow are concerned, however it is fully funcitoning. An admin demo account (with now write access) can be used to demo the admin page with the following credentials:
- urL: https://dylanmontagu.com/admin
- username: admin.demo@gmail.com
- password: admindemo123456


## Deployment/Hosting
For production deployment, the server is configured to serve a static build file of the frontend. Initial issues with routes not working on the cliet side were identified as stemming from react-router doing all routing on the browser side rather than an application-based structure with routes served by the server. The issue resolved by serving the static build file with every request from the client. 

The applicaiton was deployed with AWS Elastic Beanstalk, AWS's one stop solution for app deployments and hosting. Heroku was tested as an option, however due to already hosting images in AWS S3 and having alrady purchased domain names throgh AWS Route 53, it made sense to also dpeloy the application within AWS. 

Current hosting is configured to host on a single free tier t2 micro instnace fronted by an AWS Applicaiton load balancer, currently only being used for HTTP to HTTPS redirect. Cost saving measures that I plan to explore in the future include getting rid of the load balancer (currenlty my largest cost, and overkill/unnecessary for 1 instance and the amount of traffic the website receives) and implementing HTTP --> HTTPS redirect in the apache server configuration. Additionally, since the majority of the traffic is read-only resulting from viewing pictures on the website, moving all non-read operations to a serverless solutions such as AWS Lambdas and serving the frontend build file directly from S3 would allow me to no longer have to pay to maintain a EC2 instance all the time, and instead spin up lambdas as necessery adding/deleting/rearranging photos and albums. 
