# firebase-notes

auth0 webtask for taking notes in slack. 

## Setup Firebase

* Create a firebase account
* Create your secret token ** Go to settings -> Database -> add secret
* Copy and Paste this into your rules and replace <'SECRET'> with your secret
```
{
    "rules": {
        ".read": "auth != null && auth.uid === <'SECRET'>",
        ".write": "auth != null && auth.uid === <'SECRET'>"
    }
}
```
## Run the webtask
* Install the webtask cli
```
npm install -g wt-cli
```
* Initialize it
```
wt init <your email>
```
* Create the task
```
wt create slack.js --secret 'FIREBASE=<Firebase URL>|<Firebase secret>'
```
** Replace <Firebase URL> and <Firebase secret> with your url and secret

## Setup Slack
* Create 3 custom integrations
..* /post-it
...* Adds a note to firebase 
..* /pull-it
...* Gets a note by id
..* /list-it
...* Gets the last note posted

* Add your web task URL as the endpoint to post to. 

### Use it
You can now add notes to your firebase database from slack!
