---
external: false
title: Make your website live with Serverless framework - Little Bits
description: Quickly deploy your gatsby website to AWS S3 Bucket with Serverless Framework.
date: 2019-08-09
---

##### Little Bits is a series of short articles explaining quick solutions to common dev problems. No unnecessary descriptions or code snippets. No bullshit.

#### What we are going to do?

Deploy [GatsbyJS](https://www.gatsbyjs.org/) project to [AWS S3](https://aws.amazon.com/s3/) bucket, with live URL to view the website.

#### What tools we are going to use?

- [GatsbyJS](https://www.gatsbyjs.org/)
- [Serverless](https://serverless.com/)
- [Serverless finch plugin](https://github.com/fernando-mc/serverless-finch)

#### Plan

1. Create AWS account.
2. Setup credentials

- Install the Serverless framework globally.
- Create an IAM User and Access Key
- Setup AWS credentials on your machine.

3. Create GatsbyJS starter project.
4. Install the Serverless project and serverless-finch plugin.
5. Setup configuration for the plugin.
6. Deploy the website.

### 1. Create AWS account.

Pretty self-explanatory. To start using AWS, you need to create an account.
NOTE: You'll have to add your credit card details, but don't worry, AWS have free tiers and you'll probably won't go over them. Unless you'll use some massive AI calculations, and stick with the S3, you're sorted.
![AWS Web console](https://articles-images-123123123898989.s3-eu-west-1.amazonaws.com/Screen+Shot+2019-08-05+at+13.13.45.png)

### 2. Setup credentials

##### Install Serverless framework globally.

From your terminal run:

```bash
npm install -g serverless
```

or, if you're using Mac:

```bash
sudo npm install -g serverless
```

##### Create an IAM User and Access Key

Login to your AWS account and go to the Identity & Access Management (IAM) section. Create a new user with Admin permissions.

##### Setup AWS credentials on your machine

Get your access key and secret key from IAM account and run the command from your terminal:

```bash
serverless config credentials --provider aws --key <your-access-key> --secret <your-secret-key>
```

Watch this awesome, short [video](https://www.youtube.com/watch?v=KngM5bfpttA) from Serverless if you're stuck.

### 3. Create gatsby starter project.

From the terminal run:

```bash
gatsby new my-awesome-website https://github.com/gatsbyjs/gatsby-starter-default
```

Of course, it doesn't have to be GatsbyJS project, you can use whatever you want.

### 4. Install the Serverless project and serverless-finch plugin.

In terminal go to your new website folder:

```bash
cd my-awesome-website
```

Now simply run:

```bash
serverless
```

and follow the prompts. Remember to choose AWS Node.js environment.
Now install the serverless-finch plugin. To do it, run:

```bash
npm install --save serverless-finch
```

### 5. Setup configuration for the plugin.

To set up the plugin, update your serverless.yml file with:

```yaml
plugins:
  - serverless-finch
custom:
  client:
    bucketName: unique-s3-bucketname #Bucket will be created automatically.
    distributionFolder: public
    #You can find more config options on the plugin's GitHub page.
```

Your serverless.yml file should look something like that(after removing all the comments from the installation process):

```yaml
service: awesome-name
app: awesome-name-app
org: your-name

provider:
  name: aws
  runtime: nodejs10.x
plugins:
  - serverless-finch
custom:
  client:
    bucketName: unique-s3-bucketname #Bucket will be created automatically.
    distributionFolder: public
    #You can find more config options on plugins github page.
functions:
  hello:
    handler: handler.hello
```

### 6. Deploy the website.

From the terminal run the build process for your website:

```bash
npm run build
```

After that run the deployment command:

```bash
serverless client deploy
```

and follow the prompts. At the end of the proccess, you'll receive an URL for your shiny new website.

### Summary

That's it, you've managed to successfully deploy your static website to AWS S3 Bucket. Now you can try and add a custom domain name, connect your website to CloudFront or whatever else is needed.
If you liked this article, and you think that short, compact form is cool (or if you don't 😃) let me know in the comments section.
