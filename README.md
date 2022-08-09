# WebServer + Rest

Recordar ejecutar ```npm install``` para reconstruir los modulos de Node.

NOTES:
HEROKU DEPLOY
----ESTABLECIMIENTO DE VARIABLES DE ENTORNO----
heroku config - para ver las variables de entorno
heroku config:set VARIBLENUEVA="KEY" - Establecimiento de la varible con comillas a diferencia de la local

----Despliegue----
git add .
git commit -m "Mensaje"
git push heroku main/master - puede ser main o master por default, verificar rama primero
heroku logs -n 100 --tail - ver logs - ultimos 100 - tail en tiempo real