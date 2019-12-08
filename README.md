# Authentication for Static Sites
The goal is to add a secure authentication mechanism to static S3 sites using Cloudfront and Lambda@Edge functions. You can check out more detailed instructions over at [gooch.me](https://gooch.me/blog/post/add-authentication-to-a-static-s3-site)

![Diagram](https://gooch.me/media-library/teaser-development-secure-s3.svg "diagram")

## lambda-api-gateway-backend
An API gateway function to create encoded tokens which will be added into a cookie.

## lambda-edgelocation_auth-check
A lambda function which will be ties to the viewer request in Cloudfront to check for an authorization cookie.

## react-login-form
A simple login form. Update the location the data posts to and add your page locaion into the "homepage" part of package.json.