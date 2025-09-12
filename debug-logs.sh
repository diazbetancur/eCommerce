#!/bin/bash
# Script para capturar logs específicos de la app

echo "🔍 Iniciando monitoreo de logs de la aplicación..."
echo "📱 Dispositivo: $(adb devices | grep device | head -1)"
echo "⏰ Timestamp: $(date)"
echo "=================================="

# Limpiar logs anteriores
adb logcat -c

echo "🚀 Logs listos. Ahora instala y abre la aplicación..."
echo "🔧 Filtrando por: Firebase, Expo, ReactNative, eCommerce, Error, Exception"
echo "=================================="

# Filtrar logs relevantes con múltiples patrones
adb logcat | grep -E "(Firebase|🔥|🚀|🔧|ReactNativeJS|ExpoModulesCore|eCommerce|AMPMapp|Error|Exception|FATAL|AndroidRuntime)" --line-buffered | while read line; do
    echo "[$(date '+%H:%M:%S')] $line"
done