# Core del sistema eCommerce

Este directorio contiene la configuración, servicios y utilidades globales para la app. Permite personalizar la marca, tema y módulos activos para cada empresa.

## Estructura
- `config/`: Configuración de tema, branding y módulos.
- `services/`: Servicios genéricos (API, autenticación, almacenamiento).
- `utils/`: Validaciones, formateadores y constantes globales.

## Multiempresa
Al clonar la app para una nueva empresa, solo debes modificar los archivos de `config/` para personalizar colores, logo, nombre y módulos activos.

## Extensibilidad
Puedes agregar nuevos servicios y utilidades en este directorio sin afectar la lógica de los módulos independientes.
