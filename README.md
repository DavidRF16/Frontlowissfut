# Frontlowissfut

Frontend de LowissFut preparado para Railway.

## Railway

Configura estas variables en el servicio del frontend antes de hacer deploy:

- `VITE_API_URL`: URL publica del backend. Puede ser `https://tu-back.up.railway.app` o `https://tu-back.up.railway.app/api`.
- `VITE_SOCKET_URL`: URL publica del backend sin `/api`, por ejemplo `https://tu-back.up.railway.app`.

Railway debe ejecutar:

- Install: `npm ci`
- Build: `npm run build`
- Start: `npm start`
- Healthcheck: `/`
