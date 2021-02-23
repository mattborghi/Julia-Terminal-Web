# RUN CLIENT
gnome-terminal --tab --title="Client" -- bash -c "cd client; npm run start"

# RUN FRONTEND
gnome-terminal --tab --title="Server" -- bash -c "cd server; npm run start"
