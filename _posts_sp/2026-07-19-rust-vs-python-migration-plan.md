---
title: "Un lenguaje de moda no es un plan de migración"
date: 2026-07-19
slug: rust-vs-python-migration-plan
topic: iam
lang: es
description: "Un ingeniero de sistemas e IAM prueba Rust tras años con Python y C++ — dónde se gana un lugar en el trabajo real de automatización, dónde no, y por qué un lenguaje de moda nunca es por sí solo motivo para reescribir algo que ya funciona."
translation: "/blog/2026/07/rust-vs-python-migration-plan/"
---

No empecé a evaluar Rust porque tuviera un problema que lo necesitara. Empecé porque suficiente gente a mi alrededor no dejaba de preguntarme por qué no lo había hecho.

Parte de esa presión era razonable. Rust te da rendimiento nativo y elimina categorías enteras de errores de memoria, su juego de herramienta es coherente, y se ha ganado terreno real en infraestructura, herramientas de línea de comandos, sistemas embebidos y servicios sensibles a la seguridad. Parte era simplemente ruido. Un lenguaje se pone de moda, algunas empresas respetadas publican sus historias de adopción, se acumulan las charlas de conferencias, y de repente cada aplicación que funciona parece candidata a una reescritura. La gente empieza a hablar de la elección de lenguaje como una declaración de identidad en lugar de una decisión de ingeniería con requisitos, restricciones y una factura de mantenimiento incluida.

Llevo diecinueve años en ingeniería de sistemas, la última década sobre todo en gestión de identidades y accesos (IAM), integración y automatización. Mi trabajo consiste en conectar sistemas que nunca se diseñaron para hablar entre sí, reconciliar datos de identidad hechos un desastre, cuidar APIs poco fiables y mantener con vida automatizaciones mucho después de que quienes las escribieron se fueran. Mis dos lenguajes por defecto son C++ y Python. C++ me enseñó a preocuparme por la memoria, los tiempos de vida y las interfaces. Python me enseñó que entregar la respuesta correcta esta semana casi siempre vale más que entregar la elegante el mes que viene.

Así que cuando Rust se convirtió en el lenguaje que todos insistían en que probara, lo probé. Lo que sigue es anecdótico: mis sistemas, mis problemas, mis entornos. 

## Este post no es un benchmark

Las discusiones sobre lenguajes casi siempre arrancan con la velocidad. Cuál corre más rápido, cuál usa menos memoria, cuál aguanta más peticiones. Preguntas legítimas, y casi siempre las equivocadas para el trabajo que hago yo.

La mayor parte de mi automatización se pasa la vida esperando. Esperando la API de un proveedor de identidad, una base de datos, un directorio. Respetando tasa de límites. Reintentando fallos. Reconciliando registros de dos sistemas que no se ponen de acuerdo ni en qué es un «usuario». Cuando un script se queda 300 milisegundos esperando una llamada remota, recortar una operación local en cinco milisegundos  no cambia nada que una persona vaya a notar. El lenguaje más rápido sigue esperando a la API.

Por eso Python ha mantenido su sitio conmigo. Me lleva de la idea al prototipo que funciona casi sin ceremonia, y la parte difícil de la automatización de IAM rara vez es correr el bucle rápido. Es averiguar qué se supone que significa el bucle. «Deshabilita las cuentas inactivas» se convierte en «deshabilita las cuentas inactivas durante 90 días, salvo que sean cuentas de servicio, salvo que la fuente de verdad todavía las considere activas, salvo que haya una excepción abierta en la plataforma de gobernanza». Python me deja ir tanteando esa ambigüedad con un REPL abierto.

## El experimento

Quería un primer proyecto que se pareciera a algo que de verdad pondría en producción, no a una calculadora de juguete. Así que construí una pequeña herramienta de reconciliación de identidades: leer registros de dos fuentes, normalizar los campos, comparar estado y permisos, marcar los conflictos, escribir un informe legible por máquina, devolver códigos de salida de verdad.

En Python ya sabía cómo lo escribiría: empezar con datos imperfectos, imprimir cosas, ir afinando sobre la marcha. Rust me obligó a responder preguntas antes de siquiera arrancar. ¿Qué es exactamente un registro de identidad? ¿Qué campos son opcionales? ¿Qué errores puede producir esta operación? ¿De quién es este valor, y cuánto tiempo necesita vivir? Al principio sentí que el compilador me estorbaba. Después me di cuenta de que me estaba obligando a responder lo que Python siempre me había dejado aplazar.

## Donde Rust se ganó su sitio

Varias cosas me convencieron rápido.

**Modelar estados.** IAM está lleno de estados que nunca deberías tratar como intercambiables: cuenta no encontrada, cuenta deshabilitada, cuenta activa pero sin gestionar, permiso ausente, permiso pendiente de retirada, el sistema de origen no respondió. En un script laxo de Python todo eso se colapsa en una sopa de booleanos, cadenas vacías y nulos. Rust me empujó a nombrar cada uno. Eso no hace que mi política de accesos sea correcta (el compilador no me puede decir si un empleado debería tener un rol privilegiado) pero sí hace que los estados equivocados sean más difíciles de escribir por accidente.

**Manejo de errores.** En automatización, el fallo es lo normal. Las APIs expiran, los tokens caducan, los registros desaparecen entre dos llamadas. Python deja que esos fallos sigan invisibles hasta que uno te muerde en producción. Rust pone el fallo en el tipo de retorno de la función, así que quien la llama tiene que decidir qué hacer con él. Para un agente de larga duración, eso vale el código extra. Para un script de migración de una sola vez, es sobrecarga.

**Cargo y el binario único.** Viniendo de C++, donde las compilaciones y las dependencias pueden comerse la primera semana de alguien nuevo, Cargo me pareció casi sospechoso de lo bien que funcionaba sin más. Y entregarle a alguien un binario autocontenido (sin intérprete, sin virtualenv, sin el "¿qué Python es este?") es una ventaja real cuando estás repartiendo una herramienta por muchos equipos o metiéndola en un entorno restringido. La fricción de despliegue es una de las pocas cosas que me harían elegir Rust sobre Python para una herramienta nueva sin pensármelo dos veces.

El borrow checker del que todo el mundo se queja dejó de ser una pelea en cuanto dejé de intentar vencerlo y empecé a leer sus errores como feedback de diseño. Casi siempre me pillaba guardando una referencia que no necesitaba, o compartiendo datos que debería haber transformado. Aun así, el coste es real. Algunos problemas de ownership, sobre todo alrededor de async, convirtieron un cambio de cinco minutos en Python en una tarde entera. La corrección después de tres días no es automáticamente mejor que la corrección después de tres horas. El contexto decide si el seguro extra valió la pena.

## La parte que la moda se salta

Donde la moda se pone cara es en la reescritura. Una reescritura parece limpia porque borra la deuda técnica que ves. También borra todo lo que no ves: el reintento que existe porque un endpoint devuelve éxito antes de que el dato esté listo, el campo que se normaliza dos veces porque dos sistemas usan Unicode distinto, la categoría de cuenta que se excluye porque sigue un proceso de gobernanza aparte. Nada de eso aparece en el diagrama de arquitectura. Vive en el código, en las pruebas y en la memoria de quien estaba de guardia. Una reescritura empieza sin nada de eso.

Rust puede evitar un use-after-free. No puede evitar que un equipo se deje una excepción de acceso de hace diez años que nadie documentó. En IAM, un programa que quita de forma fiable el acceso equivocado no es más seguro por estar escrito en un lenguaje con memoria segura. «Todo el mundo usa Rust» nunca fue un motivo de ingeniería. Así que no voy a reescribir un sistema de Python o C++ que funciona por seguir una moda. Cuando sí echo mano de Rust dentro de algo que ya funciona, lo hago en una frontera (un parser caliente, un colector, un agente) donde puedo medirlo contra el código viejo y dar marcha atrás si me equivoco.

## Cómo decido de verdad

Después del experimento, echo mano de Rust cuando puedo responder que sí a varias de estas:

- El rendimiento es un problema *medido*, no teórico. Lo que hay ahora incumple un objetivo o no aguanta el volumen.
- La simplicidad de despliegue importa: un binario único para muchos equipos, o un entorno restringido donde las dependencias son una pelea.
- Es algo de larga duración o concurrente: un servicio, un procesador de eventos, un agente, no un script que termina en dos segundos.
- Procesa entrada no confiable o sensible, donde la memoria segura vale lo que cuesta.
- El equipo puede mantenerlo de verdad cuando yo ya no esté. El tiempo de formación va en la estimación, no en las notas al pie.

Cuando no se cumple nada de eso, Python sigue siendo el camino más corto del problema a la solución, y suele ganar.

## Dónde acabé

Rust cambió un poco cómo pienso. Me volvió más deliberado al modelar estados y más honesto con los caminos de error. Cada lenguaje mueve la complejidad a alguna parte: Python la empuja al runtime y a las pruebas, C se la entrega al programador, Rust la empuja al compilador y al tiempo que inviertes por adelantado. Ninguno la hace desaparecer.

Usaré Rust cuando necesite un binario nativo fiable, rendimiento predecible o garantías de memoria segura que valgan su coste. Seguiré usando Python cuando el problema real sea integración, experimentación o lógica de negocio que cambia tres veces por semana. Y dejaré el C++ que funciona donde está.

Rust se ganó un sitio en mi caja de herramientas. No se ganó el mando de ella, y ningún lenguaje lo consigue por moda. Ese sitio se gana un proyecto a la vez.
