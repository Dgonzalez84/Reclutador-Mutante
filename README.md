# Reclutador de Mutantes para MAGNETO

## Requerimientos

- [Node and npm] (http://nodejs.org)
- [MongoDB] (https://www.mongodb.com/es)


## API

#### Consta de dos servicios:

    * SERVER: ec2-3-85-56-18.compute-1.amazonaws.com
    * ENRUTADOR: NGINX
    * LLAMADO: 
        http://ec2-3-85-56-18.compute-1.amazonaws.com/stats (GET)
        http://ec2-3-85-56-18.compute-1.amazonaws.com/mutant (POST)
    
1. **POST /mutant** -- Encargado de verificar si un DNA es mutante o no, de acuerdo a diferentes paramentros. 
    * Contiene validaciones extra para filtrar matices NxN y con datos validos.
    * Valida si encuentra combinaciones de letras con expresiones regulareas dinamicas (Horizontales / Verticales / Oblicuas)
    * Se rige bajo un proceso asincronico, utilizando el patron ASYNC/AWAIT lo que le permite poder atender varias peticiones por segundo.

2. **GET /stats** -- Encargado de devolver el analisis de las verificaciones realizadas en el servicios anterior. Generando un resultado como el siguiente:
    * Los datos se recuperan a traves de una consuta a la base, y asi se evita el procesamiento en memoria

~~~
{
    count_mutant_dna: 10
    count_human_dna: 3
    ratio: 0.3
}
~~~

#### Respuestas Genericas:

Se creo una structura para que todas las respuestas complan con tal formato a la hora de devolver informacion:

~~~
{
    "status": 200/403 o 500,
    "message": "",
    "data": {}
}
~~~

## Log de inicio de servidor

`[2018-12-24T15:38:02.687] [INFO] MutantIdentifier-Server - MutantIdentifier app listening on port: 3000`

## Testeo

1. La aplicacion posee test automaticos que verifican el comportamiento de cada servicio generado. El cual genera un informe final de convertura como el siguiente ejemplo:

|File                      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
|--------------------------|----------|----------|----------|----------|-------------------|
|All files                 |    94.29 |    79.17 |    96.55 |    94.89 |                   |
| MagnetoML                |      100 |      100 |      100 |      100 |                   |
|  server.js               |      100 |      100 |      100 |      100 |                   |
| MagnetoML/api/controller |    92.68 |       80 |      100 |    92.68 |                   |
|  mutantController.js     |    92.68 |       80 |      100 |    92.68 |          42,43,87 |
| MagnetoML/api/dao        |       80 |       50 |     87.5 |    82.61 |                   |
|  querys.js               |       80 |       50 |     87.5 |    82.61 |       26,27,42,43 |
| MagnetoML/api/routes     |      100 |      100 |      100 |      100 |                   |
|  index.js                |      100 |      100 |      100 |      100 |                   |
|  mutant.js               |      100 |      100 |      100 |      100 |                   |
| MagnetoML/api/tools      |      100 |    83.33 |      100 |      100 |                   |
|  mutantValidator.js      |      100 |    83.33 |      100 |      100 |                14 |


## Opciones al levantar el sevidor con npm:

|   Comando   |  Linea que ejecuta en terminal                                        |
|-------------|-----------------------------------------------------------------------|    
| npm start   |  forever start --minUptime 5000 -o out.log -e err.log server.js       |
| npm test    |  node server.js                                                       |
