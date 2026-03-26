# NTA

A simple note-taking app with a self-hosted sync & backup server.

## Features

- **Simple Interface**: Minimal design focused on writing.
- **Command Palette**: Anything extra is handled through `Ctr+P` following a command like `.open`, `.make`, `.import` etc.
- **Works offline**: Install as a PWA for offline access.
- **Sync & Backup**: Powered by Yjs CRDTs and a Hocuspocus server, just point the app to your self-hosted server to backup your notes and sync across devices.

## App

- **Option 1**: Just use https://nta.glebbash.dev

- **Option 2**: Deploy yourself on GitHub Pages or any static hosting. It's just a single page Vite app with PWA config, run `npm i && npm run build` and serve the contents of the `dist` folder. Ensure your hosting supports HTTPS if you want PWA features to work properly.

## Sync & Backup server

The server is powered by Hocuspocus, a Yjs websocket server implementation.

### Connection

When you have a server set up, use the following UI commands:
- `.key` set your user key - any device sharing the same user key will get its notes synced together. If you have multiple users on the same server, think of it as a username+password combo field.
- `.sync` command entering `wss://<your-server-url>::<TOKEN>` to connect to your server. (The double colon is used as a separator, it's not a typo)

### Data Storage and Backup

Notes are stored locally on devices first, but the sync server maintains a complete database of all changes across users. Local data on a device might not have all latest version notes until they are opened - rely on the server for full backups.

### Assembling the server

You can assemble it as you like ([docs](https://tiptap.dev/docs/hocuspocus/server/configuration)).

You can host it on Fly.io (for free) and it will just work, but you'll need to worry about data backup, a VPS is better if you just want to ssh in and copy your data.

> Note on TLS:
> 
> You must have a separate TLS termination proxy. I used Cloudflare DNS SSL proxy that came with a domain, but you can also use Nginx or something. 
> 
> If you go without TLS you'd have to serve the app over HTTP as well, since browsers block non-secure websocket connections from secure contexts.
>
> You can also use a self-signed cert and add an exception in your browser, but that's quite annoying cause you'd have to do it on every device you want to sync with.

> Note on serverless hosting:
>
> it might sound appealing to just deploy the server on a serverless platform like Deno Deploy or Cloudflare Workers, but it won't work because the server needs to maintain a persistent websocket connection with the clients, and serverless platforms typically don't support that. Thus you'll need to have a VPS or use something like Fly.io that can run a long-running process.

### My setup

I tried a bunch of different hosting providers and setups, the one I ended up with uses a VPS (that I already had for other projects) to have easy access to notes data and a domain from Cloudflare with their free SSL proxy in front of the server. A bunch of domain registrars offer free DNS hosting with SSL proxy, so you can just buy a cheap domain and use that.

> Prerequisites:
> - Node.js 24+ (for native TypeScript execution).
> - A Linux system with systemd (for the server setup).

**Step 1: Clone the repo and install deps:**

```bash
git clone https://github.com/glebbash/nta && npm i
```

**Step 2: Configure the server by creating a `data/.env`:**

```
PORT=6969
TOKEN=<any-random-string-here>
```

> NOTE: the token is used as as an API key. Treat it like a secret, anyone with the token and your user key can read and update your notes.

**Step 3: Create the systemd service file:**

```bash
cat << EOF | sudo tee /etc/systemd/system/nta.service
[Unit]
Description=NTA Server
After=network.target

[Service]
User=$USER
WorkingDirectory=$PWD
ExecStart=$(which node) ./sync-server.ts
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

**Step 4: Manage the service:**

```bash
# (re)start the service, and enable on boot
sudo systemctl daemon-reload \
  && sudo systemctl enable --now nta \
  && sudo systemctl restart nta \
  && sudo systemctl status nta

# check the status
sudo systemctl status nta

# view live logs
sudo journalctl -u nta -f
```
