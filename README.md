MobPartner
=========
[MobPartner] [1] is a Mobile Affiliate Platform used in [WidPlay][2]. The API it's very basic. With this API can get your statistics account. This library use promises.

Installation
--------------
npm install mobpartner

Methods
--------------
    * today
    * yesterday
    * thisweek
    * lastweek
    * thismonth
    * last7days
    * last30days
    * lastmonth
    * thisyear
    * lastyear
    * interval

See that
--------------
> Note that we use promises syntax

Example
--------------
```js
var MobPartner = require('mobpartner');
var mobpartner = new MobPartner('yourkey', 'yourlogin');
mobpartner.today()
    .then(function(stats){
        console.log(stats);
    });
```

Example 2
--------------
```js
var MobPartner = require('mobpartner');
var mobpartner = new MobPartner('yourkey', 'yourlogin');
mobpartner.interval('20140324', '20140326')
    .then(function(stats){
        console.log(stats);
    });
```


 

Version
----
0.0.1


License
----
MIT

[MobPartner]:http://www.mobpartner.com/en/
[WidPlay]:http://widplay.com/