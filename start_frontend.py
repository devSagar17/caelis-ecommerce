import http.server
import socketserver
import threading
import os

# Change to the project directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Define the port
PORT = 8000

# Create the server
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving HTTP on port {PORT} (http://localhost:{PORT}/) ...")

# Start the server in a separate thread
server_thread = threading.Thread(target=httpd.serve_forever)
server_thread.daemon = True
server_thread.start()

try:
    # Keep the main thread alive
    server_thread.join()
except KeyboardInterrupt:
    print("\nShutting down servers...")
    httpd.shutdown()