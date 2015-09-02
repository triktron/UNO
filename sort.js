var fs = require("fs");
var files = fs.readdirSync("./img").sort(function (a, b) {
    var n1 = Number(a.replace(/^\D+|\D+$/g, ""));
    var n2 = Number(b.replace(/^\D+|\D+$/g, ""));
    return n1 < n2 ? -1 : 1;
});

next(0);

function next(num) {
    if (files.length < num) return;
        fs.rename("./img/" + files[num], "./img/uno" + (num) + ".gif",function(){next(num+1)});
}