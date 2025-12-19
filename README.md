# Twilio Voice Call Center

Sistema de centro de llamadas con **Twilio Voice SDK**, construido con Next.js, React y TypeScript. Permite recibir y realizar llamadas telefónicas en tiempo real.

## 🚀 Características

- 📞 **Llamadas entrantes y salientes** en tiempo real
- 🎨 **Interfaz moderna y responsive** con diseño premium
- ⚡ **Twilio Voice SDK** integrado
- 🔒 **TypeScript** para mayor seguridad
- 📊 **Historial de llamadas** con duración y detalles
- 🔇 **Control de audio** (silenciar/activar)
- 🎯 **Estados de agente** (Disponible, En llamada, Desconectado)
- ⏱️ **Contador de duración** de llamadas en tiempo real

## 📋 Requisitos Previos

- Node.js 18+ instalado
- **Cuenta de Twilio** ([Crear cuenta gratis](https://www.twilio.com/try-twilio))
- Credenciales de Twilio configuradas

## 🛠️ Configuración de Twilio

### Paso 1: Obtener Credenciales

1. Ve a la [Consola de Twilio](https://console.twilio.com/)
2. Copia tu **Account SID** y **Auth Token**

### Paso 2: Crear API Key

1. Ve a **Account** → **API keys & tokens**
2. Crea una nueva API Key (Standard)
3. Guarda el **API Key SID** y **API Secret**

### Paso 3: Crear TwiML App

1. Ve a **Voice** → **TwiML Apps**
2. Crea una nueva TwiML App
3. Configura las URLs:
   - **Voice Request URL**: `https://tu-dominio.com/api/voice` (o usa ngrok para desarrollo local)
   - **Voice Method**: POST
4. Guarda el **TwiML App SID**

### Paso 4: Comprar un Número de Teléfono

1. Ve a **Phone Numbers** → **Buy a number**
2. Compra un número de teléfono
3. Configura el número:
   - **Voice & Fax** → **Configure with**: TwiML App
   - Selecciona la TwiML App que creaste

## 📦 Instalación

1. **Instala las dependencias**:
```bash
npm install
```

2. **Configura las variables de entorno**:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=tu_api_secret_aqui
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

3. **Ejecuta el servidor de desarrollo**:
```bash
npm run dev
```

4. **Abre** [http://localhost:3000](http://localhost:3000) en tu navegador

## 🌐 Configuración para Desarrollo Local (ngrok)

Para recibir llamadas en desarrollo local, necesitas exponer tu servidor con ngrok:

1. **Instala ngrok**: [ngrok.com/download](https://ngrok.com/download)

2. **Ejecuta ngrok**:
```bash
ngrok http 3000
```

3. **Copia la URL HTTPS** que ngrok te proporciona (ej: `https://abc123.ngrok.io`)

4. **Actualiza tu TwiML App** en Twilio:
   - Voice Request URL: `https://abc123.ngrok.io/api/voice`

## 📁 Estructura del Proyecto

```
twilio-flex-call-center/
├── app/
│   ├── api/
│   │   ├── token/route.ts      # Genera tokens de acceso
│   │   └── voice/route.ts      # Maneja TwiML para llamadas
│   ├── about/                  # Página de información
│   ├── screener/calls/         # Página del centro de llamadas
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de inicio
│   └── globals.css             # Estilos globales
├── components/
│   └── FlexCallCenter.tsx      # Componente principal del call center
├── .env.example                # Plantilla de variables de entorno
└── package.json
```

## 🎯 Uso

### Recibir Llamadas

1. Asegúrate de que el servidor esté corriendo
2. Ve a `/screener/calls`
3. Espera a que el estado cambie a "Disponible"
4. Llama a tu número de Twilio desde cualquier teléfono
5. Aparecerá una notificación de llamada entrante
6. Haz clic en "Aceptar" para contestar

### Realizar Llamadas

1. Ve a `/screener/calls`
2. Ingresa un número de teléfono con código de país (ej: +1234567890)
3. Haz clic en "Llamar"
4. La llamada se conectará automáticamente

### Controles Durante la Llamada

- **Silenciar**: Desactiva tu micrófono
- **Colgar**: Finaliza la llamada actual
- **Historial**: Ve todas las llamadas realizadas y recibidas

## 🔧 API Endpoints

### POST `/api/token`

Genera un token de acceso para el Twilio Device.

**Request**:
```json
{
  "identity": "agent"
}
```

**Response**:
```json
{
  "token": "eyJhbGc...",
  "identity": "agent"
}
```

### POST `/api/voice`

Maneja el enrutamiento de llamadas (TwiML).

**Parámetros**:
- `To`: Número de destino (opcional)
- `From`: Número de origen

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. **Sube tu código a GitHub**

2. **Importa en Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Agrega las variables de entorno

3. **Actualiza la TwiML App**:
   - Voice Request URL: `https://tu-app.vercel.app/api/voice`

### Railway / Render

Similar a Vercel, solo necesitas:
1. Conectar tu repositorio
2. Agregar variables de entorno
3. Actualizar la URL en Twilio

## 🔒 Seguridad

- ✅ Tokens de acceso con expiración (1 hora)
- ✅ Variables de entorno para credenciales
- ✅ Validación de requests en API routes
- ⚠️ **Importante**: Nunca expongas tus credenciales en el código