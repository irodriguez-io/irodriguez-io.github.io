---
title: "Los ocho dominios de la ciberseguridad"
date: 2024-05-15
slug: eight-domains-cybersecurity
lang: es
image: /img/art04.jpg
description: "Un recorrido práctico por el cuerpo común de conocimiento del CISSP de (ISC)²: los ocho dominios y cómo se aplican al trabajo real."
translation: "/blog/2024/05/eight-domains-cybersecurity/"
---

El CISSP agrupa el trabajo de seguridad en ocho dominios. No son ocho trabajos distintos. Son ocho ángulos del mismo problema: cómo proteger los datos, los sistemas y a las personas sin romper el negocio que depende de ellos.

Un poco de historia primero. El International Information System Security Certification Consortium, *(ISC)²*, se formó en 1989 al unir varios grupos de profesionales de seguridad informática que querían un estándar neutral, no atado a un proveedor, para una disciplina emergente. El primer Common Body of Knowledge (CBK) se finalizó en 1992. La certificación Certified Information Systems Security Professional (CISSP) se lanzó en 1994. Hoy (ISC)² tiene su sede en Alexandria, Virginia, y los ocho dominios que siguen son la estructura que utiliza para definir qué se espera que sepa un CISSP.

A continuación cada dominio, qué cubre en realidad y el tipo de trabajo que produce en el día a día.

## 1. Seguridad y gestión de riesgos

Esta es la capa de políticas y gobierno. Cubre la evaluación de riesgos, el cumplimiento regulatorio, la continuidad del negocio y los objetivos de seguridad contra los cuales se mide el resto del programa. En el día a día, este es el dominio que tiene la respuesta a "¿qué exige HIPAA?", "¿qué exige PCI-DSS?" y "si este control falla, ¿cuál es el impacto al negocio?". Cuando aparece una nueva regulación, este es el dominio que la traduce en política interna.

## 2. Seguridad de activos

La seguridad de activos trata sobre los datos y el equipo que los contiene. Clasificación, retención, almacenamiento y disposición final viven aquí. Desechar una laptop dada de baja no es un problema logístico, es un problema de datos: si el disco sale sin borrarse, los datos salen con él. La misma lógica aplica a los respaldos, a los recursos compartidos y a cualquier sistema que contenga registros de los que la organización es responsable.

## 3. Arquitectura e ingeniería de seguridad

Este dominio diseña los controles. Segmentación de red, reglas de firewall, cifrado en reposo y en tránsito, proxies con conciencia de identidad, imágenes base endurecidas. La meta es que el camino seguro sea el camino por defecto, para que la organización no dependa de que cada usuario tome la decisión correcta cada vez. El trabajo de arquitectura también es donde se decide qué *no* construir, porque cada sistema adicional es superficie de ataque adicional.

## 4. Seguridad de comunicaciones y redes

La seguridad de red cubre los canales: cableados, inalámbricos, VPN y todo lo que mueve tráfico entre sistemas. El trabajo se divide entre endurecer la infraestructura (segmentación, TLS, monitoreo) y moldear el comportamiento del usuario (no conectar equipos corporativos a wifi abiertas, no exponer servicios internos mediante herramientas personales). Ambos importan. La red puede estar sólida, y aun así un usuario pegando una credencial en el formulario equivocado te compromete.

## 5. Gestión de identidades y accesos

Este es el dominio en el que trabajo, así que tengo una opinión clara aquí. IAM es el plano de control de quién puede hacer qué. Cubre la verificación de identidad, la autenticación, la autorización y todo el ciclo de vida de una cuenta desde la contratación hasta la terminación. Single sign-on, aprovisionamiento por SCIM, accesos por grupo, MFA y revisiones de acceso viven en este dominio. Hecho bien, IAM es invisible: la gente recibe los accesos que necesita el primer día, los pierde el día que se va, y nada en el medio queda huérfano. Hecho mal, IAM es por donde las brechas consiguen su primer punto de apoyo.

## 6. Evaluación y pruebas de seguridad

Este es el dominio que pregunta "¿está funcionando realmente el control que pusimos?". Escaneo de vulnerabilidades, pruebas de penetración, revisiones de acceso, recolección de evidencia para auditoría. El trabajo es repetitivo a propósito. Un control que funcionó el trimestre pasado puede dejar de funcionar este trimestre porque se actualizó un sistema, se agregó un permiso o cambió un proceso. La única manera de saberlo es probarlo otra vez.

## 7. Operaciones de seguridad

Operaciones de seguridad es el lado en vivo: monitoreo, detección, respuesta a incidentes y el trabajo que ocurre cuando suena una alerta a las 2 a. m. Este dominio es dueño del SIEM, del EDR, de los playbooks y de la rotación on-call. Su medida de éxito es qué tan rápido un incidente pasa de "algo se ve mal" a "lo contuvimos y sabemos qué pasó".

## 8. Seguridad en el desarrollo de software

La seguridad en el desarrollo de software integra los otros siete dominios al ciclo de vida del software. Modelado de amenazas en la etapa de diseño, estándares de codificación segura, revisión de dependencias, manejo de secretos y pruebas de seguridad como parte del CI. La meta es mover los hallazgos de seguridad lo más a la izquierda posible, porque una vulnerabilidad detectada en revisión de código cuesta mucho menos arreglar que la misma vulnerabilidad detectada en producción.

---

Los ocho dominios son un mapa, no una lista de tareas. La mayoría de los profesionales de seguridad trabajan a profundidad en uno o dos y se mantienen conversacionales en el resto. Lo que el marco del CISSP te da es un vocabulario compartido, para que cuando el equipo de red, el equipo de IAM y el equipo de seguridad de aplicaciones estén en la misma revisión de incidente, usen las mismas palabras para describir el mismo problema.

Si estás empezando, escoge el dominio que se ajuste al trabajo que tienes enfrente y profundiza ahí. Los otros siete entrarán en escena tan pronto comiences a coordinar entre equipos, que en la práctica es la mayor parte del trabajo.
