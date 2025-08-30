# Configuración de Privy para Confiado

## Problema Actual
Error 403 "Login with Google not allowed" - indica configuración incorrecta de OAuth.

## Solución Paso a Paso

### 1. Configurar Privy Dashboard
1. Ve a [Privy Dashboard](https://dashboard.privy.io)
2. Crea una nueva aplicación o usa la existente
3. En **Settings > Login Methods**, habilita Google OAuth
4. Configura los **Redirect URIs**:
   - `http://localhost:3000` (desarrollo)
   - Tu dominio de producción
5. Copia tu **App ID** desde el dashboard

### 2. Crear Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Copia .env.example y renómbralo a .env.local
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales:
```
NEXT_PUBLIC_PRIVY_APP_ID=tu_app_id_real_aqui
NEXT_PUBLIC_APP_NAME=Confiado
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Verificar Configuración OAuth en Google
En el dashboard de Privy, asegúrate de que:
- Google OAuth esté habilitado
- Los redirect URIs incluyan `http://localhost:3000`
- El dominio esté verificado

### 4. Reiniciar Servidor
```bash
pnpm dev
```

## Alternativa: Deshabilitar Google Temporalmente
Si necesitas continuar desarrollando, puedes deshabilitar Google OAuth temporalmente editando `contexts/PrivyContext.tsx`:

```typescript
loginMethods: ['email', 'wallet'], // Remover 'google', 'twitter'
```

## Notas Importantes
- El App ID hardcodeado actual es de prueba y no tiene Google OAuth configurado
- Necesitas tu propio App ID de Privy con OAuth configurado
- El archivo `.env.local` está en `.gitignore` por seguridad
