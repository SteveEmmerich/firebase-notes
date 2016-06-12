"use strict";
"use latest";
const Firebase = require('firebase');

/*const config = {
    apiKey: "AIzaSyBfczXSPA7yzEbyispkiBSoR1M7WF-CM1I",
    authDomain: "notes-9622b.firebaseapp.com",
    databaseURL: "https://notes-9622b.firebaseio.com",
    storageBucket: "notes-9622b.appspot.com",
  };
  firebase.initializeApp(config);*/

module.exports = function (ctx, req, res)
{
    function genResponse(code, data)
    {
        res.writeHead(code, {'Content-Type': 'application/json'});
        res.end(data);
    }
    
    const FIREBASE = ctx.data.FIREBASE;
    let endpoint = FIREBASE.split('|')[0];
    let secret = FIREBASE.split('|')[1];

    let firebase = new Firebase(endpoint);
    firebase.authWithCustomToken(secret, (err) => {
        if(err)
        {
            console.error(err);
            genResponse(500, err);
            return;
        }
        switch(ctx.data.command)
        {
            case '/post-it': {
               var id = firebase.push(ctx.data.text);
                genResponse(200, 'posted ' + ctx.data.text + ' id: ' + id.key());
                break;
            }
            case '/pull-it': {
                firebase.child(ctx.data.text).once('value',
                    (snap) => {
                        genResponse(200, snap.val());
                    },
                    (err) =>
                    {
                        genResponse(500, err);
                    });
                break;
            }
            case '/list-it': {
                
                firebase.limitToLast(1).on('child_added', 
                    (snap) => {
                        genResponse(200, snap.val()); 
                    },
                    (err) => {
                        genResponse(500, err);
                    });
                break;
            }
            default: {
                genResponse(500, 'Command not found');
            }
        }  
    })
}
