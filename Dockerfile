# Stage 1: build- use UBI Node.js image
FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS builder

# 1. set workdir and role
USER 0
RUN mkdir -p /app && \
    chown -R 1001:0 /app && \
    chmod -R g+rwX /app
WORKDIR /app

# 2. cp package file
COPY --chown=1001:0 package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 3. install respository
USER 0
RUN npm install --production=false --registry=https://registry.npmjs.org/ --no-fund --no-audit && \
    find /app/node_modules -type f -perm /u+x -exec chmod a+x {} \; && \
    find /app/node_modules -type d -exec chmod 755 {} \; && \
    npm cache clean --force && \
    ls -la /app/node_modules/.bin/vite

# 4. set role
COPY --chown=1001:0 . .

# 5. run vite
USER 1001
RUN node /app/node_modules/vite/bin/vite.js build

# 6. prepare output
USER 0
RUN mkdir -p /output && \
    cp -a /app/dist/. /output && \
    chown -R 1001:0 /output
USER 1001

# Stage 2:  run - use UBI Nginx image
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# 2. clean and set role
USER 0
RUN rm -rf /etc/nginx/conf.d/* && \
    mkdir -p /var/log/nginx /var/cache/nginx && \
    [ -d "/etc/nginx" ] && chmod -R g+rwX /etc/nginx || true && \
    [ -d "/var/log/nginx" ] && chmod -R g+rwX /var/log/nginx || true && \
    [ -d "/var/cache/nginx" ] && chmod -R g+rwX /var/cache/nginx || true

# 3. cp self nginx configure file
COPY --chown=1001:0 nginx.conf /etc/nginx/nginx.conf

# 4. output
COPY --from=builder --chown=1001:0 /output /usr/share/nginx/html

# 5. set role
RUN chmod -R 755 /usr/share/nginx/html && \
    if command -v fix-permissions >/dev/null 2>&1; then \
        fix-permissions /usr/share/nginx/html && \
        fix-permissions /etc/nginx; \
    fi

# 6. change nginx user
USER 1001

# 7. expose port
EXPOSE 8080

# 8. start
CMD ["nginx", "-g", "daemon off;"]