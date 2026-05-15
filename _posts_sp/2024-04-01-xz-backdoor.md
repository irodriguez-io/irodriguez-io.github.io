---
title: "Entendiendo la puerta trasera XZ"
date: 2024-04-01
slug: xz-backdoor
lang: es
image: /img/art03.png
description: "Análisis de la puerta trasera en XZ Utils (CVE-2024-3094) — qué pasó, por qué importa, y qué lecciones de cadena de suministro quedan."
translation: "/blog/2024/04/xz-backdoor/"
---

Un descubrimiento reciente nos ha recordado una verdad perenne: la seguridad es una batalla sin fin. La última frontera en esta batalla es la vulnerabilidad 'XZ Backdoor', un problema crítico que ha logrado pasar desapercibido hasta su reciente desmascaramiento.

## ¿Qué es la Vulnerabilidad XZ Backdoor?

En términos simples, la puerta trasera XZ es como un pasaje secreto ilícito en lo que debería ser una fortaleza de tus sistemas digitales. Es una debilidad severa dentro del software XZ Utils, una herramienta utilizada para comprimir y descomprimir archivos en Linux y otros sistemas similares a Unix. Esta vulnerabilidad otorga acceso no autorizado a un sistema, como dejar la puerta trasera de tu casa sin cerrar, solo que en este caso, ni siquiera sabías que había una puerta allí.

La parte de la puerta trasera entra en juego con una de las principales formas en que se usa xz - SSH. SSH es un protocolo cifrado entre dos máquinas donde se pueden intercambiar comandos de texto, permitiendo a un usuario interactuar con un servidor. Es una utilidad muy común en el mundo de Linux y la seguridad de esta comunicación es crítica. La puerta trasera significa que la conexión ya no es privada y podría permitir a un atacante insertar sus propios comandos de texto en la conexión segura.

## ¿Cómo Surgió?

Imagina un jardín comunitario donde todos agregan plantas y ayudan a que crezca; esto es similar al desarrollo de software de código abierto. XZ Utils, mantenido durante años por solo una persona dedicada, sufrió cuando alguien introdujo una planta tóxica, por así decirlo. Esta "planta" creció con el tiempo, sin ser notada debido a su camuflaje inteligente, hasta que sus raíces se extendieron profundamente en el sistema.

Un nuevo desarrollador, "Jia Tan", aprovechó la naturaleza abierta y confiada de la comunidad de código abierto para implementar esta puerta trasera. Al enviar parches aparentemente inocentes durante 2 años y manipular la dinámica de la comunidad, este individuo ganó confianza y, eventualmente, acceso crítico al proyecto.

## Descripción Breve de la Línea de Tiempo

**2021:** JiaT75 (Jia Tan) crea su cuenta en GitHub. Los primeros commits que hace no son para xz, pero son profundamente sospechosos. El código que envía hace un poco más de lo que dice.

En abril de 2022, Jia Tan envió un parche a través de una lista de correo. El contenido del parche no es relevante, pero los eventos que siguen sí lo son. Una nueva persona — Jigar Kumar — entra en la conversación y comienza a presionar para que este parche se fusione. Aquí es cuando JiaT75 hace su primer commit en xz. Desde este commit, se convierte en un colaborador regular de xz.

El 7 de enero de 2023, JiaT75 fusiona su primer commit en el repositorio xz, lo que nos da una buena indicación de cuándo obtiene plenamente la confianza. Se compromete la infraestructura de prueba que se utilizará en este exploit.

A principios de 2024 se agrega un commit que contiene los pasos finales necesarios para ejecutar esta puerta trasera al repositorio.

Esta vulnerabilidad fue descubierta por un empleado vigilante de Microsoft en marzo de 2024 y posteriormente se le asignó el identificador CVE-2024-3094.

## Asegurando que tus Sistemas Estén Protegidos

Para proteger tus sistemas personales y empresariales, es imperativo:

- **Buscar la vulnerabilidad:** Herramientas como la proporcionada por la empresa de seguridad Binarly pueden ayudarte a identificar si tu sistema está comprometido.
- **Aplicar parches inmediatamente:** Si se detecta la vulnerabilidad, aplica los parches liberados por tu proveedor de distribución de Linux sin demora.
- **Mantenerse informado:** Suscríbete a avisos de seguridad para obtener la información más reciente sobre vulnerabilidades y parches.

## Un Llamado a la Vigilancia en Ciberseguridad.

Este evento es un recordatorio contundente de que la complacencia en la ciberseguridad puede tener consecuencias graves. Mientras que el modelo de código abierto promueve la colaboración y la innovación, también exige vigilancia y un enfoque proactivo hacia la seguridad.

Como analista de seguridad de la información, mi mensaje es claro: nunca subestimes la importancia de una mentalidad vigilante. En ciberseguridad, el enemigo suele ser invisible, las tácticas siempre están evolucionando, y la batalla es interminable. Esto no es para inducir miedo, sino para fomentar la conciencia y la acción. Mantente educado, aplica parches diligentemente y fortifica tu dominio digital. Recuerda, una sola puerta trasera desatendida puede comprometer la seguridad de toda la estructura.

En una era donde la seguridad digital es primordial, no permitamos que nuestra guardia baje. Es nuestra responsabilidad compartida proteger la integridad de nuestros sistemas, por el bien de nuestra seguridad personal, nuestros negocios y la confianza de aquellos a quienes servimos. Mantén las puertas cerradas, las ventanas aseguradas y la vigilancia constante.
