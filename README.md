This is the code im using at stuartbingham.net, my portfolio website. I have had a local repo of this code for sometime now, but i had not bothered making it available on github until 2/4/2018.

Alright, new-ish framework rebuild. Thistime using vite + react/bootstrap.

Provisioning the project:

npm install
npm run build

docker build . -t portfolio
docker run -d -p 80:80 -p 443:443 portfolio

//docker interactive command for installing the cert:
docker exec -it [docker-container-id] certbot --nginx -d stuartbingham.net -d www.stuartbingham.net

