---
title: "Los agentes de IA para programar son identidades sin gobernar"
date: 2026-05-21
slug: ai-coding-agents-unmanaged-identities
topic: iam
lang: es
description: "Los agentes de IA para programar como Cursor, Claude Code y Copilot son identidades no humanas que operan con credenciales humanas — sin alta-cambio-baja (JML), sin controles de sesión y con una vía de exfiltración incorporada. La solución es el manual de IAM que ya conocemos."
translation: "/blog/2026/05/ai-coding-agents-unmanaged-identities/"
---

El asistente de IDE que tus desarrolladores instalaron la semana pasada incumple más cláusulas de tu política de control de accesos de las que cualquier contratista humano podría incumplir jamás.

Lo digo literalmente. Saca tu política de accesos. Léela línea por línea. Después mira cómo Cursor, Claude Code o Copilot llegaron al portátil de cada ingeniero en tu organización, y dime con cara seria que cumple.

Imagina que un contratista llega un lunes. Conecta un portátil personal a tu red. Pide acceso de lectura a cada repositorio, cada wiki, cada secreto en el archivo `.env` de cada desarrollador. Quiere que su credencial siga funcionando después de que termine el contrato. Quiere operar fuera de tu SSO, tu Acceso Condicional y tu device trust. Y quiere desplegar código en tu nombre sin nunca iniciar sesión como él mismo.

Escalarías a seguridad en noventa segundos.

Tus ingenieros hicieron todo eso la semana pasada. De forma voluntaria. Y lo llamaron "productividad para desarrolladores."

## Estos agentes son identidades, no herramientas

Los agentes de IA para programar no son herramientas de productividad. Son identidades no humanas que operan con las credenciales de un humano. La mayoría de los equipos de seguridad no se han puesto al día porque la historia de compra parece una licencia de $20 por usuario, no una nueva identidad privilegiada que está siendo aprovisionada con más alcance que tu IC más senior.

La parte que debería preocuparte: cada agente de IDE que se ejecuta en tu entorno es una identidad con privilegio permanente, sin alta-cambio-baja (JML), sin controles de sesión, sin revisión y con una vía de exfiltración incorporada. Por cada política que has escrito, es una violación.

Tres razones.

## 1. Hereda privilegio permanente y amplio, sin revisión

Tus desarrolladores tienen acceso de lectura legítimamente amplio. Múltiples repositorios, documentación interna, secretos en dotfiles, a veces lectura de producción para depurar. Ganaron ese acceso con tickets, aprobaciones y revisiones a lo largo del tiempo.

El agente lo hereda todo en el momento en que el desarrollador pega un PAT o inicia sesión con OAuth. Sin solicitud de acceso. Sin flujo de aprobación. Sin entrada en tu IGA. Ningún User Access Review lo va a detectar, porque el UAR está revisando humanos.

Nunca le concederías ese alcance a una persona en treinta segundos. Acabas de concedérselo a una identidad no humana que puede leer cada archivo que el desarrollador puede leer, y enviarlo a un endpoint de inferencia que no has evaluado.

## 2. No tiene Alta, Cambio, Baja

El PAT vive en un archivo de configuración. El refresh token de OAuth vive en el keychain del sistema. El token del servidor MCP vive en un archivo JSON en el directorio home del desarrollador.

Cuando el desarrollador rota de equipo, ajustas el alcance de su cuenta en Okta. El token del agente no se reajusta.

Cuando el desarrollador se va, deshabilitas su cuenta. El token del agente, más a menudo que no, sigue funcionando hasta que expira por su propio calendario. Pueden ser noventa días. Puede ser nunca. Y el token está sobre un dispositivo personal sobre el que ya no tienes visibilidad.

No hay proceso de baja para una identidad que no está en tu grafo de identidades.

## 3. Hace un túnel alrededor de cada control que construiste

Acceso Condicional está limitado a sesiones de usuario en tu IdP. Device trust está limitado a dispositivos gestionados. Las listas blancas de IP están limitadas a rangos corporativos. La autenticación step-up se dispara en la sesión del usuario, no en la llamada API del agente.

El agente opera fuera de todo eso. A menudo desde un dispositivo personal. A menudo enviando código, prompts y secretos a un endpoint de inferencia de un tercero que no está en el alcance de tu DLP ni en tus controles de egress.

Tu SIEM ve a la identidad del usuario actuando. No ve al agente. Tu historia forense para "qué hizo el agente el 15 de octubre entre las 2 y las 4 de la tarde" es, hoy, que no puedes saberlo.

## Cómo se ve esto en la práctica

Un patrón que he visto, hecho deliberadamente genérico:

Un ingeniero senior se cambia a un nuevo equipo. Su pertenencia a grupos en Okta se reajusta — pierde acceso a los repositorios del equipo anterior. Pero el PAT fine-grained de GitHub que generó para su agente de IDE hace seis meses, cuando todavía estaba en el equipo anterior, sigue teniendo el alcance original. El agente sigue leyendo el código del equipo anterior cada vez que el ingeniero abre la carpeta del proyecto donde vive ese token en `.env`.

Seis meses después el mismo ingeniero deja la empresa. Su cuenta de Okta se da de baja esa misma tarde. El PAT — todavía en su MacBook personal, que usaba ocasionalmente para conectarse porque la VPN corporativa fallaba — sigue funcionando hasta que expira por calendario, 47 días después. Durante 47 días, el agente de programación de un empleado dado de baja tiene acceso de lectura a repositorios que ningún empleado actual de la empresa debería poder leer.

El IGA no muestra excepciones. El UAR del trimestre pasado estuvo limpio. El SIEM, mirando hacia atrás, ve al usuario de GitHub del ingeniero leyendo los repositorios — exactamente la actividad que ha visto durante años. No hay nada por lo que alertar.

Eso es lo que "sin JML para identidades no humanas" realmente cuesta.

## Lo que no va a arreglar esto

He escuchado todas las respuestas fáciles en los últimos seis meses. Ninguna es la respuesta.

"Bloquea las herramientas." Tus desarrolladores usarán cuentas personales en dispositivos personales. No lo vas a ver. Lo vas a ver menos de lo que lo ves ahora.

"Entrena a la gente." ¿Sobre qué, exactamente? Están usando una herramienta de productividad que su VP les dijo que probaran. No vas a salir del privilegio permanente entrenando a la gente.

"Usa el tier enterprise del proveedor." Claro, hazlo. Sigue heredando los permisos del usuario y sigue operando fuera del perímetro de tu IdP. Es una mejor postura. No es una solución.

## La solución real es poco glamorosa

La solución real es el manual de IAM que ya conoces. Tokens con alcance acotado, no PATs clásicos. TTLs cortos. Cuentas de servicio específicas para agentes, con su propio ciclo de vida, dueño y cadencia de revisión. Logs de auditoría que distingan al humano del agente. Políticas de Acceso Condicional que traten "llamada API desde contexto de agente" como una señal de postura, no solo como una señal de sesión de usuario.

Así se ve en términos concretos.

El PAT que un desarrollador típicamente genera hoy para un agente de IDE tiene aproximadamente esta forma:

```yaml
# PAT clásico de GitHub — la forma en que la mayoría de los agentes están conectados hoy
scopes:
  - repo            # lectura/escritura completa a cada repositorio al que el usuario tiene acceso
  - workflow        # modificar GitHub Actions
  - read:org        # ver toda la membresía de la organización
  - gist            # crear gists públicos (una vía de exfiltración conocida)
expiry: 90 días     # o nunca, si el usuario eligió "sin expiración"
identity_in_logs:   indistinguible del usuario
```

Cómo debería ser, en términos de alcance:

```yaml
# PAT fine-grained — con alcance por agente
resource_owner: acme-org
repositories:
  - acme-org/api-service       # solo el repositorio en el que este agente está ayudando activamente
permissions:
  contents: read
  metadata: read
  pull_requests: write         # si necesita abrir PRs
expiry: 7 días                 # rotación semanal, obligatoria
identity_in_logs:  ID de token distinto, mapeado a un service principal
```

El YAML es ilustrativo — GitHub no configura los PATs fine-grained desde un archivo — pero la forma del *alcance* es real. El agente lee un repositorio, no el mundo. Las escrituras están limitadas donde necesitan estarlo. El token rota lo suficientemente rápido como para que uno filtrado expire antes de que importe.

Envuelve ese token en una cuenta de servicio del lado de Okta que viva en un grupo dedicado `Agent-Service-Accounts`, con un dueño humano nombrado, un UAR trimestral específico para identidades no humanas, y una política de Acceso Condicional que marque actividad API desde fuera de contextos de agente conocidos. Nada de eso es nuevo. Solo que no lo hemos estado haciendo para agentes.

Hemos gobernado identidades no humanas antes. Lo hicimos mal con las cuentas de servicio. Y estamos a punto de hacerlo mal otra vez con los agentes de IA — solo que esta vez la identidad toma decisiones.

## Esto no es terreno nuevo

Si lees NIST 800-207, los siete principios de Zero Trust Architecture son el argumento que estoy haciendo en este post, escritos seis años antes de que existieran los agentes de IA para programar. El principio 3 dice que el acceso a los recursos empresariales se concede por sesión. Un PAT de 90 días no es por sesión. El principio 4 dice que el acceso se determina por política dinámica que considera el estado observable de la identidad, la aplicación y el activo solicitante. Un agente de IDE en un portátil no gestionado no es ninguna de esas cosas, por diseño. El principio 6 dice que toda autenticación y autorización son dinámicas y estrictamente aplicadas antes del acceso. La autenticación del agente sucedió una vez, hace meses, en un archivo de configuración que el IdP nunca ve.

El Zero Trust Maturity Model de CISA pone a muchas organizaciones en Avanzado en el pilar de Identidad hoy — MFA, acceso condicional, automatización del ciclo de vida, todo el paquete. Los agentes de IA para programar bajan silenciosamente esa puntuación de vuelta a Inicial para una categoría entera de identidad que nadie está midiendo. El modelo de madurez asume que sabes qué identidades existen en tu entorno. El asistente de IDE que tus desarrolladores instalaron la semana pasada, por cualquier medida observable, no está en tu grafo de identidades.

## Hacia dónde va esto

Vamos a mirar atrás al 2026 de la misma forma en que miramos atrás al 2010 con la proliferación de cuentas de servicio. Excepto peor, porque estas escriben código.

Si trabajas en IAM o seguridad y tu organización ya ha empezado a gobernar estos como gobernarías cualquier otra identidad privilegiada, quiero saber. Prohibir, ignorar y "ya lo veremos el próximo trimestre" son las tres opciones que veo más a menudo.

Tengo curiosidad por saber si alguien ha probado la opción cuatro.
