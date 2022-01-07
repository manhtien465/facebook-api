import fs from 'fs';
import worker from './worker';
import provider from './common/providers';
import persistent from './config/persistent';

// open mongoose connection
persistent
    .connect()
    .then(() => {
        provider.register();
        worker.register();
        setInterval(() => {
            fs.closeSync(fs.openSync('/tmp/alive', 'w'));
        }, 15000);

        function terminate(exitCode) {
            return () => {
                console.log('Terminating');
                worker.close();
                setTimeout(() => {
                    persistent.disconnect().then(() => {
                        process.exit(exitCode);
                    });
                }, 1000);
            };
        }

        // handle close
        process.on('SIGINT', terminate(0));
        process.on('SIGTERM', terminate(0));
        process.on('SIGUSR1', terminate(-1));
    })
    .catch((err) => {
        console.log(err);
        process.exit(-1);
    });
