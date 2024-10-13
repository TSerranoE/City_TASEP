from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import threading
app = Flask(__name__)
CORS(app)

# def run_simulation():
#     while True:
#         time.sleep(0.5)  

# # Start the simulation in a separate thread
# simulation_thread = threading.Thread(target=run_simulation)
# simulation_thread.start()





@app.route('/update_data', methods=['POST'])
def update_data():
    data = request.json
    intersections = data['intersections']
    extreme_points = data['extremePoints']
    size = data['size']
    
    # Aquí puedes procesar los datos como necesites
    print(f"Received data: Intersections: {intersections}, Extreme Points: {extreme_points}, Size: {size}")
    
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/state', methods=['GET'])
def get_state():
    # Aquí puedes devolver el estado actual de tu simulación
    return jsonify({"state": "some state data"})

if __name__ == '__main__':
    app.run(debug=True)