from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import threading
app = Flask(__name__)
CORS(app)
from Calle import Calle
from Interseccion import Interseccion
from Particula import Particula
from Calles import Calles


calles = Calles([])

# def run_simulation():
#     while True:
#         time.sleep(0.5)  

# # Start the simulation in a separate thread
# simulation_thread = threading.Thread(target=run_simulation)
# simulation_thread.start()





@app.route('/update_data', methods=['POST'])
def update_data():
    data = request.json
    #intersections = data['intersections']
    extreme_points = data['extremePoints']
    #size = data['size']
    for extreme_point in extreme_points:
        direccion , posicion =    extreme_point.split(";")
        print(direccion, posicion)
        calle = Calle(direccion=int(direccion), intersecciones=[], posicion=int(posicion))
        calles.add_calle(calle)
    calles.update_intersecciones()
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/state', methods=['GET'])
def get_state():
    # Aquí puedes devolver el estado actual de tu simulación
    return jsonify({"state": "some state data"})

if __name__ == '__main__':
    app.run(debug=True)