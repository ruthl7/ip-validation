FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend /tmp/frontend-dist

RUN set -eu; \
		if [ -f /tmp/frontend-dist/index.html ]; then \
			cp -R /tmp/frontend-dist/. /usr/share/nginx/html/; \
		elif [ -f /tmp/frontend-dist/browser/index.html ]; then \
			cp -R /tmp/frontend-dist/browser/. /usr/share/nginx/html/; \
		else \
			echo "Unable to locate Angular build output in /tmp/frontend-dist" >&2; \
			exit 1; \
		fi; \
		rm -rf /tmp/frontend-dist

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
