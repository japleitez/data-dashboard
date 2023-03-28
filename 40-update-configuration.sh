#!/bin/sh
sed -i 's/ENV/'"$ENV"'/g' /usr/share/nginx/html/assets/config/env-json-config-prod.json
sed -i 's/REGION/'"$REGION"'/g' /usr/share/nginx/html/assets/config/env-json-config-prod.json
sed -i 's/POOL_ID/'"$POOL_ID"'/g' /usr/share/nginx/html/assets/config/env-json-config-prod.json
sed -i 's/DOMAIN/'"$DOMAIN"'/g' /usr/share/nginx/html/assets/config/env-json-config-prod.json
sed -i 's/CLIENT_ID/'"$CLIENT_ID"'/g' /usr/share/nginx/html/assets/config/env-json-config-prod.json
