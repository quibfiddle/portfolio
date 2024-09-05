This is the code im using at stuartbingham.net, my portfolio website. I have had a local repo of this code for sometime now, but i had not bothered making it available on github until 2/4/2018.

Hello again! Update 5 years later! Removed all the node.js structure and configured the pages for static hosting via Nginx in Docker. Simple :)

Provisioning the project:

docker build . -t portfolio
docker run -d -p 80:80 -p 443:443 portfolio

//docker interactive command for installing the cert:
docker exec -it my-apache-server certbot --apache -d stuartbingham.net -d www.stuartbingham.net