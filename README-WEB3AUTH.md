# Configuración de Web3Auth para Confiado

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=tu_client_id_aqui
```

## Obtener Client ID de Web3Auth

1. Ve a [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Selecciona "Web" como plataforma
5. Configura:
   - **Project Name**: Confiado
   - **Network**: Sapphire Devnet (para desarrollo)
   - **Allowed Origins**: 
     - `http://localhost:3000` (desarrollo)
     - Tu dominio de Vercel (producción)
6. Copia el Client ID y agrégalo a tu `.env.local`

## Configuración para Vercel

En tu dashboard de Vercel:

1. Ve a Settings → Environment Variables
2. Agrega: `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` con tu Client ID
3. Asegúrate de que esté disponible para Production, Preview y Development

## Funcionalidades Implementadas

- ✅ Autenticación con Web3Auth
- ✅ Protección de rutas
- ✅ Integración con dashboard
- ✅ Componentes de login/logout
- ✅ SSR habilitado
- ✅ Manejo de estado de usuario

## Archivos Principales

- `components/providers.tsx` - Configuración de Web3Auth
- `components/auth/web3auth-sign-in.tsx` - Botón de inicio de sesión
- `components/auth/web3auth-logout.tsx` - Botón de cierre de sesión
- `app/layout.tsx` - Integración de providers
- `app/dashboard/page.tsx` - Dashboard protegido

## Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar tipos
npx tsc --noEmit

# Build para producción
npm run build
```
