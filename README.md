# Steam Link - Portal de Prácticas Profesionales STEM

## 🛠️ Instalación

Antes de comenzar, asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Grupo3-Diplomado-Udenar/Proyecto_Diplomado.git
   ```
2. Entra al directorio del frontend:
   ```bash
   cd stem-web
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## 💻 Desarrollo

### Modo Web
Para ejecutar la aplicación en el navegador:
```bash
npm run dev
```

### Modo Escritorio (Electron)
Para probar la aplicación como una aplicación de escritorio con recarga en vivo:
```bash
npm run electron:dev
```

## 📦 Empaquetado (Generar Ejecutable)

Para generar la aplicación final para Windows (formato portable):

1. Limpia y compila la aplicación:
   ```bash
   npm run electron:build
   ```
2. Al finalizar, el ejecutable se encontrará en la carpeta:
   **`stem-web/release/Steam Web 0.0.0.exe`**
