"use strict";
"use latest";
const Firebase = require('firebase');

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
    });
}
