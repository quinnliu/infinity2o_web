# infinity2o.com

## Setup

1.  `node -v` = v8.9.3 & `npm -v` = 5.6.0
2.  `heroku -v` = `heroku-cli/6.15.13-3dce47c (darwin-x64) node-v9.3.0`

## Backend & frontend development setup

### heroku.com:

1.  Login with `qn1over12@gmail.com` & password = `mxxxxFxxxxxIxxxxxx`
2.  Heroku Redis addons:

- Local Development & Staging: `heroku addons:info redis-transparent-42654`
  - Connect to AWS redis = `heroku redis:cli -a infinity2o-staging -c infinity2o-staging`
  - View all keys = `KEYS *`
  - Delete a key = `DEL keyValue`
- Production: `heroku addons:info redis-reticulated-26782`
  - Connect to AWS redis = `heroku redis:cli -a infinity2o -c infinity2o`

### mlab.com databases:

1.  Login with `qliu` & password = `mxxxxFxxxxxIxxxxxx`
2.  `infinity2o-dev` database username = `infinity2o-dev` & password = `2134711p`
3.  `infinity2o-staging` database username = `infinity2o-staging` & password = `2134711p`
4.  `infinity2o-prod` database username = `infinity2o-prod` & password = `mxFxxxxxIxxxx`
5.  Backups are stored at https://bitbucket.org/quinnliu/mongodb_data

### Google OAuth:

1.  Login `console.developers.google.com` with `q42liu@gmail.com` under projects
    `infinity2o-dev`, `infinity2o-staging`, & `infinity2o-prod`

### LinkedIn OAuth:

1.  Login: `hunterzhaoliu@gmail.com`

### Stripe.com login:

1.  Login with `qn1over12@gmail.com` & password = `mxxxxFxxxxxIxxxxxx`

### Sendgrid.com login:

1.  username = `infinity2o`, email = `askinfinity2o@gmail.com`, & password = `mxxxxFxxxxxIxxxxxx`

### Google Domains

1.  Login with `hunterzhaoliu@gmail.com`

### Godaddy.com login:

1.  Login with `q42liu@gmail.com` & password = `49xxxxxx@wxxxxx`
2.  Already added name servers(NS) `karl.ns.cloudflare.com` & `wally.ns.cloudflare.com`
3.  Add forwarding to domain: `https://www.infinity2o.com` by adding
    subdomains `infinity2o.com` & `www`

### Cloudflare.com

1.  Login with `qn1over12@gmail.com` & password = `21xxxxx@ix`
2.  Already added 2 CNAMEs.
    - Name: `infinity2o.com` Value: `www.infinity2o.com.herokudns.com`
      TTL: `Automatic` Status: `Arrow through cloud`
    - Name: `www` Value: `www.infinity2o.com.herokudns.com`
      TTL: `Automatic` Status: `Arrow through cloud`

### E-mail support:

1.  `askinfinity2o@gmail.com` & password = `mxxxxFxxxxxIxxxxxx`. Recovery = Hunter's phone & `q42liu@gmail.com`

### Affiliate marketing account:

#### Coursera.org, Udemy.com, and Codeacademy.com

e-mail = `askinfinity2o@gmail.com`, username = `infinity2o`, & password = `21xxxxx@ix`. http://cli.linksynergy.com/cli/publisher/home.php?lang=en

#### edx.org

e-mail = `askinfinity2o@gmail.com`, username = `infinity2o`, & password = `mxxxxFxxxxxIxxxxxx`. https://ui.awin.com/user

### Local development setup:

1. `cd infinity2o_web`
2. `npm install`
3. `npm run dev`

### AWS development setup:

1.  `cd` into `minerva/config` and SSH into server with `chmod 400 infinity2o-minerva.pem` and `ssh -i infinity2o-minerva.pem ubuntu@18.234.188.1`.
2.  Clone minerva repository and update staging and production config files

### Copy production MongoDB data to other MongoDB database:

1.  clone the remote folder on Bitbucket to local computer
2.  `cd` into `prod`
3.  `mongodump -h ds153412.mlab.com:53412 -d infinity2o-prod -u infinity2o-prod -p mxFxxxxxIxxxx -o <output directory>`
    where `<output directory>` is the current date
4.  commit the new data to Bitbucket
5.  go to the database in MongoDB and find the mongorestore command under the tools tab
6.  delete all collections in database and then mongorestore the production data by `cd` into wanted production data date folder

- Development Example: `mongorestore -h ds121686.mlab.com:21686 -d infinity2o-dev -u infinity2o-dev -p 2134711p <input db directory>`
  where `<input db directory>` is `infinity2o-prod`

### Development workflow checklists

When you want to add something...

1.  Create a `new-branch` off latest `master`
2.  Create `actions/types`
3.  Create `actions/actionCreator.js`
4.  Deal with action type in `reducers/actionReducer.js`
5.  Add `reducers/actionReducer.js` to `reducers/index.js`
6.  If state changes add `mapStateToProps` in `containers/Containers.js`
7.  If added functions to change state add `mapDispatchToProps` in `containers/Containers.js`
8.  Create a `pull request` for your `new-branch` to merge into `master`

### Deployment checklist

1.  `cd infinity2o_web`
2.  `heroku login` username = `qn1over12@gmail.com` & password = `mxxxxFxxxxxIxxxxxx`
3.  If first time, `git remote add heroku-staging https://git.heroku.com/infinity2o-staging.git` and `git remote add heroku https://git.heroku.com/infinity2o.git`
4.  `git checkout staging`
5.  `git push origin staging`
6.  `git push heroku-staging staging:master`
7.  Check code is deployed on https://infinity2o-staging.herokuapp.com/
8.  `git checkout master`
9.  `git merge --no-ff staging`
10. `git push origin master`
11. `git push heroku master`
12. Check code is deployed on https://infinity2o.herokuapp.com/
13. Check code is deployed on https://www.infinity2o.com/

### Design principles

1.  [Fletcher Color Control](http://www.barnstonestudios.com/content/COLOUR-CONTROL-by-Frank-Morley-Fletcher.pdf)
2.  `color` beside `opposite color` is the most contrasting.
3.  `color` surrounded by grey changes grey into shade of `color`.

### Domain name

The key idea is we want to direct all different ways one can type our
domain name and redirect it to `https://www.infinity2o.com`

Right now if one types `www.infinity2o.com`

They will get redirected to `https://www.infinity2o.com`

### Useful links

[HTTP status codes](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
