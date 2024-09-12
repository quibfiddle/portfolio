This is the code im using at stuartbingham.net, my portfolio website. I have had a local repo of this code for sometime now, but i had not bothered making it available on github until 2/4/2018.

Alright, new-ish framework rebuild. This time using vite + react/bootstrap.

Provisioning the project:

docker build . -t portfolio
docker run -d -p 80:80 -portfolio

It's set up to allow ssl via reverse proxy.

