FROM quay.io/keycloak/keycloak:latest

COPY realm-export.json /opt/keycloak/data/import/realm-export.json

EXPOSE 8080

CMD ["start", "--import-realm"]
