# Usa una versión específica de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /opt/app

# Copia los archivos de package y package-lock para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación escuchará
EXPOSE 8080


# Comando para iniciar la aplicación
CMD ["npm", "start"]
