---
title: "Implementando el Marco de Ciberseguridad del NIST"
date: 2024-07-01
slug: nist-cybersecurity-framework
lang: es
image: /img/art05.jpg
description: "Gobernar, Identificar, Proteger, Detectar, Responder, Recuperar. Aplicando el NIST CSF 2.0 a una pequeña o mediana empresa."
translation: "/blog/2024/07/nist-cybersecurity-framework/"
---

Las pequeñas y medianas empresas (PYMEs) tienen la misma exposición a riesgos de ciberseguridad que las empresas grandes, pero con menos presupuesto, menos especialistas y, en muchos casos, sin un equipo de seguridad dedicado. El Instituto Nacional de Estándares y Tecnología (NIST) publica el Marco de Ciberseguridad (CSF, por sus siglas en inglés) y el Marco de Gestión de Riesgos (RMF) precisamente para cubrir esa brecha. En este artículo explico cómo aplicar el CSF en una PYME sin inflarlo hasta convertirlo en un programa que el equipo no pueda sostener.

## Marco de Ciberseguridad del NIST (CSF)

El CSF es un conjunto de prácticas, estándares y recomendaciones para ayudar a una organización a gestionar el riesgo de ciberseguridad. Está organizado en seis Funciones: Gobernar, Identificar, Proteger, Detectar, Responder y Recuperar. En conjunto cubren el ciclo completo de gestión del riesgo, desde la definición de la estrategia hasta la recuperación después de un incidente.

### 1. Gobernar: la estrategia, las expectativas y la política de gestión de riesgos de ciberseguridad de la organización están establecidas, comunicadas y monitoreadas.

Entender y evaluar las necesidades específicas de ciberseguridad. Determinar los riesgos particulares que enfrenta la organización y el nivel de riesgo que está dispuesta a aceptar. Recoger aportes desde distintas áreas del equipo. Hablar abiertamente sobre lo que ha funcionado y lo que no.

Desarrollar una estrategia de riesgo de ciberseguridad a la medida. Basarla en los objetivos de la organización, su entorno de riesgo y las lecciones aprendidas de incidentes anteriores. Revisarla y actualizarla con una cadencia regular. Definir roles y responsabilidades claros para todos los involucrados.

Establecer políticas de gestión de riesgo. Las políticas deben estar aprobadas por la gerencia, aplicarse en toda la organización, ser repetibles y alinearse con el entorno actual de amenazas, los riesgos y la misión de la organización. Integrarlas en la cultura para que las personas puedan tomar decisiones informadas por su cuenta. Considerar las obligaciones legales, regulatorias y contractuales.

Desarrollar y comunicar las prácticas de ciberseguridad. Mantenerlas cortas. Documentarlas. Compartirlas. Reflejar los cambios en los requisitos del negocio, las amenazas y el entorno técnico. Dejar espacio para retroalimentación y para corregir el rumbo.

Establecer y monitorear la gestión de riesgo de la cadena de suministro. Definir estrategia, política y roles para la supervisión de proveedores, clientes y socios. Incorporar los requisitos en los contratos. Incluir a socios y proveedores en los ejercicios de planificación, respuesta y recuperación.

Implementar supervisión y puntos de control continuos. Analizar los riesgos en un calendario recurrente y monitorearlos de forma continua, igual que se hace con el riesgo financiero.

### 2. Identificar: los riesgos actuales de ciberseguridad de la organización son comprendidos.

Identificar los procesos y activos críticos del negocio. Empezar por las actividades que deben continuar para que la empresa siga operando. Por ejemplo: mantener un sitio web de pagos en línea, proteger los datos de clientes o pacientes, o mantener accesible y exacto un conjunto de datos crítico.

Mantener inventarios de hardware, software, servicios y sistemas. Saber qué computadoras, aplicaciones y servicios de proveedores usa la organización. Estos son los puntos de entrada que buscan los atacantes. El inventario puede ser tan simple como una hoja de cálculo. Incluir los dispositivos y aplicaciones propios, arrendados y personales de los empleados.

Documentar los flujos de información. Catalogar los tipos de información que la organización recopila, dónde se almacenan los datos y cómo se mueven, especialmente cuando hay contratos y socios externos involucrados.

Identificar amenazas, vulnerabilidades y riesgos para los activos. Documentarlos en un registro de riesgos, con notas sobre cómo ha cambiado cada riesgo a lo largo del tiempo. Priorizar las respuestas, ejecutarlas y monitorear los resultados.

Usar las lecciones aprendidas para refinar el programa. Después de un incidente, redactar un informe posterior que registre lo que ocurrió, lo que se hizo en respuesta, lo que se recuperó y lo que debe cambiar. Esta es la parte que la mayoría de los equipos omite; también es la parte con el mayor retorno.

### 3. Proteger: las salvaguardas para gestionar los riesgos de ciberseguridad de la organización están en uso.

Gestionar el acceso. Crear cuentas únicas para los empleados. Otorgar acceso solo a los recursos que cada persona realmente necesita. Autenticar a los usuarios antes de que accedan a información, computadoras o aplicaciones. Controlar el acceso físico a las instalaciones y a los dispositivos.

Capacitar a los usuarios. Realizar capacitaciones regulares para que los empleados conozcan las políticas de ciberseguridad, sepan reconocer ataques comunes y sepan cómo reportar actividad sospechosa. Sumar capacitación específica para puestos sensibles.

Proteger y monitorear los dispositivos. Usar productos de seguridad de endpoint. Aplicar configuraciones uniformes y controlar cómo cambian esas configuraciones. Deshabilitar los servicios y funciones que el negocio no usa. Configurar los sistemas para que generen registros (logs). Dar de baja los dispositivos de forma segura al final de su vida útil.

Proteger los datos sensibles. Cifrar los datos en reposo y en tránsito. Usar verificación de integridad para que solo se realicen cambios aprobados. Eliminar o destruir los datos de forma segura cuando ya no se necesiten.

Gestionar y mantener el software. Actualizar los sistemas operativos y las aplicaciones con una cadencia regular. Habilitar actualizaciones automáticas donde sea seguro hacerlo. Reemplazar el software fuera de soporte por versiones soportadas. Ejecutar análisis de vulnerabilidades y remediar los hallazgos.

Realizar respaldos regulares. Respaldar los datos en un calendario definido. Mantener al menos una copia frecuentemente refrescada fuera de línea para protegerla del ransomware. Probar las restauraciones. Un respaldo que nunca se ha restaurado no es un respaldo.

### 4. Detectar: los posibles ataques y compromisos de ciberseguridad son encontrados y analizados.

Monitorear redes, sistemas e instalaciones de forma continua. Construir y probar procesos para detectar indicadores de compromiso, tanto en la red como en el entorno físico. Recolectar registros (logs) de múltiples fuentes para apoyar la detección de actividad no autorizada.

Determinar y analizar el impacto y el alcance de los eventos adversos. Cuando se detecta algo, trabajar rápido para entender qué toca el incidente. Los detalles informan la respuesta.

Proporcionar información sobre los eventos adversos al personal y a las herramientas autorizadas. Encaminar las señales correctas a los responsables correctos para que el plan de respuesta a incidentes pueda arrancar limpio.

### 5. Responder: las acciones sobre un incidente de ciberseguridad detectado son ejecutadas.

Ejecutar el plan de respuesta a incidentes. Una vez declarado un incidente, ejecutar el plan en coordinación con los terceros relevantes. Confirmar que todos conozcan sus responsabilidades, incluidos los requisitos regulatorios, de reporte legal y de intercambio de información.

Categorizar y priorizar los incidentes. Determinar la causa raíz, decidir qué incidentes necesitan atención primero y comunicar esa priorización al equipo. Asegurar que el equipo sepa a quién hay que informar sobre cada incidente priorizado.

Recolectar los datos del incidente y preservar su integridad y procedencia. Capturar la información de manera que resista escrutinio posterior. Los datos recolectados deben permanecer seguros después del incidente, tanto para proteger la confianza de las partes interesadas como para informar el siguiente plan de respuesta.

Notificar a las partes interesadas internas y externas. Compartir la información del incidente conforme a las políticas, los planes de respuesta y los acuerdos de intercambio de información de la organización. Notificar a los socios de negocio y a los clientes según los requisitos contractuales.

Contener y erradicar los incidentes. Ejecutar un plan de respuesta probado es lo que contiene el impacto y elimina el incidente. La coordinación con las partes interesadas durante esta fase es lo que separa una respuesta controlada de una interrupción prolongada.

### 6. Recuperar: los activos y las operaciones afectadas por un incidente de ciberseguridad son restaurados.

Entender los roles y responsabilidades. Saber quién, dentro y fuera del negocio, tiene responsabilidades de recuperación. Saber quién tiene el acceso y la autoridad para actuar en nombre de la empresa.

Ejecutar el plan de recuperación. Devolver los sistemas y servicios afectados a su disponibilidad operativa. Priorizar y ejecutar las tareas de recuperación en el orden correcto.

Revisar el trabajo dos veces. Verificar la integridad de los respaldos y de cualquier otro activo de recuperación antes de usarlos para reanudar las operaciones del negocio.

Comunicar con las partes interesadas internas y externas. Decidir qué información se comparte, cómo y cuándo. Asegurar que cada parte interesada reciba lo que necesita y que no se divulgue nada inapropiado.

Capturar las lecciones aprendidas. Compartir con el personal cualquier actualización a procesos, procedimientos y tecnologías, consistente con la política ya establecida por la organización. Aprovechar la recuperación como oportunidad para reentrenar al equipo en prácticas de ciberseguridad mientras el incidente sigue fresco.

## Notas de cierre

Para una PYME, el CSF es más útil como una lista de verificación que se ajuste a la capacidad real del equipo, y no como un modelo de madurez al cual perseguir. Elegir un punto de partida en cada Función, documentar lo que ya está en su lugar y agregar una mejora por trimestre. El CSF premia la consistencia sobre la ambición: un programa pequeño que se ejecuta cada mes vale más que uno grande que se intenta una sola vez y luego se abandona.

Si quieres ayuda para aplicar el CSF a los sistemas, contratos e inventario específicos de tu organización, escríbeme. El marco es genérico por diseño; el valor está en adaptarlo.
