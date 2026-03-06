# NTA server (VPS edition)

> NOTE: you'll have to go to `https://<your-ip>:6969` in the browser to trust the self-signed certificates first

## Setup

1. create self-signed certs:
    ```bash
    openssl req -x509 -newkey rsa:4096 -keyout data/key.pem -out data/cert.pem -sha256 -days 365 -nodes
    ```
2. set an auth token in `data/.env`:
    ```
    TOKEN=<literally-random-value-here>
    ```
3. start a the service as a daemon:
    ```bash
    npm install -g pm2
    pm2 start index.js --name "nta"
    pm2 startup # + follow the instructions printed
    pm2 save
    ```
