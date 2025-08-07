# 🧪 Test Endpoints

## ✅ Available Endpoints

### 1. Server Status
```
GET http://localhost:3001/
```

### 2. Informasi Publik
```
GET http://localhost:3001/api/informasi
GET http://localhost:3001/api/informasi/public
```

### 3. Authentication
```
POST http://localhost:3001/api/auth/register
POST http://localhost:3001/api/auth/login
```

## 🔧 Quick Test

### Test Server
```bash
curl http://localhost:3001/
```

### Test Informasi Endpoint
```bash
curl http://localhost:3001/api/informasi
```

### Expected Response
```json
[]
```
(Empty array jika belum ada data)

## 🚨 Troubleshooting 404

1. **Server tidak berjalan**
   ```bash
   npm run dev
   ```

2. **Port salah** - Pastikan menggunakan port 3001

3. **Endpoint salah** - Pastikan URL lengkap dengan `/api/`