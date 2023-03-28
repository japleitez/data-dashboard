FROM nginxinc/nginx-unprivileged:1.20.0-alpine

LABEL project="dataAcquisitionDashboard"
LABEL author="Evangelos Sinapidis - Eurostat"
LABEL email="evangelos.sinapidis@arhs-cube.com"
LABEL documentation="https://git.fpfis.eu/estat/wihp/data-collection/data-acquisition-dashboard"
LABEL license="EUPL-1.2"
LABEL version="0.0.1"


## ADD YOUR COMMANDS
USER root
#COPY build files and nginx configuration
COPY dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY 40-update-configuration.sh /docker-entrypoint.d

RUN chown nginx:0 /etc/nginx/conf.d/default.conf
RUN chown nginx:0 /docker-entrypoint.d/40-update-configuration.sh
RUN chmod +x /docker-entrypoint.d/40-update-configuration.sh
RUN chown -R nginx:0 /usr/share/nginx/html
RUN chmod -R g+w /usr/share/nginx/html

#USE not root user configured by unprivileged image
USER nginx

