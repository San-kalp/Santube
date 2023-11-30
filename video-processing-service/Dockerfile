FROM node:18 

WORKDIR /app
COPY package*.json ./

RUN apt-get update && apt-get install -y ffmpeg 

RUN npm install 

COPY . .

EXPOSE 3000 

CMD ["npm","start"]
# FROM node:18

# WORKDIR /app

# COPY package*.json ./

# RUN npm install 

# COPY . . 

# RUN npm run build 


# FROM node:18 

# RUN apt-get update && apt-get install -y ffmpeg 

# WORKDIR /app 

# COPY package* .json ./ 

# RUN npm install --only=production 

# COPY --from=builder /app/dist ./dist

# EXPOSE 3000 

# CMD ["npm","run","serve"]








