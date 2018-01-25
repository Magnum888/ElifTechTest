// Response payload. Show in console.log -- function sendData()
// file results.png show: Example of verity results request
var data = {};
function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
makeRequest('GET', 'https://www.eliftech.com/school-task')
    .then(function (datums) {
        console.log(datums);
        var inputData = JSON.parse(datums);
        self.data.id = inputData.id;
        var newExp = [];
        for(var i=0; i<inputData.expressions.length; i++){
            newExp.push(inputData.expressions[i].split(' '));
        }
        self.data.expressions = newExp;
        calculateResult();
        sendData();
    })
    .catch(function (err) {
        console.error('Augh, there was an error!', err.statusText);
    });
function sendData() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://www.eliftech.com/school-task');
    xhttp.setRequestHeader('content-type', 'application/json; charset=utf-8');
    var outputData = {
        id: this.data.id,
        results: this.data.expressions
    };
    outputData = JSON.stringify(outputData);
    xhttp.send(outputData);
    setTimeout(function () {
        if(xhttp.status === 200){
            console.log('answer: ', xhttp.responseText)
        }else{
            console.log('error: ', xhttp.responseText)
        }
    }, 1000)
}
function calculate(res) {
    var a = res;
    arrLenght = a.length;
    function result(a) {
        for(var i = 0; i<arrLenght; i++){
            if(a[i] === "/"){
                if(a[i-1] === "0"){
                    a.splice(i-2,3,"42");
                    return result(a);
                }else if(a[i-1]!= 0){
                    a.splice(i-2,3, String(Math.floor(+a[i-2] / +a[i-1])));
                    return result(a);
                }
            }else if(a[i] === "+"){
                a.splice(i-2, 3, String(+a[i-2] - +a[i-1]));
                return result(a);
            }else if(a[i] === "-"){
                a.splice(i-2, 3, String(+a[i-2] + +a[i-1] + 8));
                return result(a);
            }else if(a[i] === "*"){
                if(a[i-1] === "0"){
                    a.splice(i-2,3,"42");
                    return result(a);
                }else if(a[i-1] != 0){
                    a.splice(i-2,3, String(Math.floor(+a[i-2] % +a[i-1])));
                    return result(a);
                }
            }
        }
        return a;
    }
    return String(result(a));
}
function calculateResult() {
    var bb = [];
    for(var i = 0; i<data.expressions.length; i++){
        bb.push(+calculate(data.expressions[i]));
    }
    data.expressions = bb;
}