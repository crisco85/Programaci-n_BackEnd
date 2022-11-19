const autocannon = require('autocannon');
const PassThough = require('stream');

function run(url){
    const buf = [];
    const outPutStream = new PassThough();

    const inst = autocannon({
        url,
        connections: 100,
        duration: 20
    })

    autocannon.track(inst, { outPutStream });
    
    outPutStream.on('data', data => buf.push(data));

    inst.on('done', () => {
        process.stdout.write(Buffer.concat(buf));
    })
}

console.log('Running all benchmark in parallel...');

run('http://localhost:8080/info');
run('http://localhost:8080/info/true');