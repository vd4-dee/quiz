# PocketBase Backend Setup Guide

## 1. Download PocketBase
- Go to: https://pocketbase.io/docs/download
- Download the latest Windows release (e.g., pocketbase_0.20.0_windows_amd64.zip)
- Extract and place `pocketbase.exe` in the `backend/` folder.

## 2. Start PocketBase Server
- Open PowerShell in the `backend/` folder.
- Run:
  ```powershell
  ./pocketbase.exe serve --http="0.0.0.0:8090"
  ```
- Access the admin UI at: [http://localhost:8090/_/](http://localhost:8090/_/)

## 3. Create Admin Account
- On first access, set up your admin email and password.
- Store credentials securely.

## 4. Folder Structure
- `pb_data/` (auto-created): stores database files
- `pb_public/`: place frontend build here

## 5. Useful Links
- Docs: https://pocketbase.io/docs/
- API Reference: https://pocketbase.io/docs/api-records/

---

## Troubleshooting
- If port 8090 is in use, change the port in the serve command.
- For LAN access, ensure Windows Firewall allows port 8090.
