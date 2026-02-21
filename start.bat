@echo off
echo Iniciando EasyRedmine...

:: Backend
cd redmine
call npm install
start "Backend" cmd /k "npx ts-node server.ts"
echo Backend iniciado

:: Frontend
cd ..\EasyRedmine
call npm install
start "Frontend" cmd /k "npx ng serve -o"
echo Frontend iniciado

echo Aplicacion corriendo en http://localhost:4200