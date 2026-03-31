#!/bin/bash
set -e

cd /var/www/letsmoveit-right

# Install production dependencies only
npm ci --omit=dev

# Stop any existing PM2 process
pm2 stop letsmoveit-right 2>/dev/null || true
pm2 delete letsmoveit-right 2>/dev/null || true

# Start the application
pm2 start index.cjs --name letsmoveit-right --env production

# Save PM2 process list for auto-restart
pm2 save
