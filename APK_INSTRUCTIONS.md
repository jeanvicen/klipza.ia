# Instruções para Gerar APK (klipza.ia)

Este repositório está preparado para ser transformado em um aplicativo nativo (Android/iOS) usando **Capacitor** ou **Cordova**.

## Pré-requisitos
- Node.js instalado
- Android Studio (para APK)

## Passo a Passo (Capacitor)

1. **Instale as dependências:**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Inicialize o Capacitor:**
   ```bash
   npx cap init klipza.ia com.klipza.app --web-dir .
   ```

3. **Adicione a plataforma Android:**
   ```bash
   npx cap add android
   ```

4. **Sincronize os arquivos:**
   ```bash
   npx cap copy
   ```

5. **Abra no Android Studio para gerar o APK assinado:**
   ```bash
   npx cap open android
   ```

## Assets
- O ícone oficial está em `assets/icons/icon-512.png`.
- Use este ícone no Android Studio para gerar as diferentes densidades de ícones do sistema.

## Publicação na Play Store
- Gere um **App Bundle (.aab)** no Android Studio para publicação otimizada.
- Certifique-se de preencher as informações de segurança de dados no console do Google Play.
