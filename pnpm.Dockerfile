FROM node:14
RUN npm i -g pnpm@7
RUN cat > /etc/apt/sources.list <<-EOF
deb http://snapshot.debian.org/archive/debian/20230411T000000Z buster main
# deb http://deb.debian.org/debian buster main \
# deb http://snapshot.debian.org/archive/debian-security/20230411T000000Z buster/updates main 
# deb http://deb.debian.org/debian-security buster/updates main 
# deb http://snapshot.debian.org/archive/debian/20230411T000000Z buster-updates main 
# deb http://deb.debian.org/debian buster-updates main
EOF

RUN apt update && apt install -y netcat-openbsd
