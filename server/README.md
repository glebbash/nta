# NTA server

> NOTE: You must have a separate service handling TLS termination. For example, Cloudflare DNS Proxy in Flexible mode works perfectly for this.

## Setup

**Step 1: Set an auth token in `data/.env`:**

```
TOKEN=<literally-random-value-here>
```

**Step 2: Create the systemd service file:**

```bash
cat << EOF | sudo tee /etc/systemd/system/nta.service
[Unit]
Description=NTA Server
After=network.target

[Service]
User=$USER
WorkingDirectory=$PWD
ExecStart=$(which node) ./index.ts
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

**Step 3: Manage the service:**

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
