# PocketBase Backend Setup

## 1. Download PocketBase
- Download the latest PocketBase for Windows from: https://pocketbase.io/docs/download
- Place `pocketbase.exe` in this `backend/` folder.

## 2. First Run
- Open PowerShell in this folder.
- Run:
  ```powershell
  ./pocketbase.exe serve --http="0.0.0.0:8090"
  ```
- Admin UI: [http://localhost:8090/_/](http://localhost:8090/_/)

## 3. Create Admin Account
- On first access, you will be prompted to create an admin account.
- Save your credentials securely.

## 4. Data & Frontend
- `pb_data/` will be auto-created for database files.
- Place frontend build in `pb_public/`.

## 5. Documentation
- See `setup-backend.md` for detailed instructions.
