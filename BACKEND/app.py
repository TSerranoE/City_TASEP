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


particulas_agregadas = []
size= 50
isStart = False
simulation_running = True
simulation_paused = threading.Event()
simulation_paused.set() 
#data_lock = threading.Lock()

def run_simulation(calles):
    
    id = 0
    while simulation_running:
        simulation_paused.wait()  # Espera si está en pausa
        if not isStart:
            time.sleep(0.1)  # Pequeña pausa para no consumir CPU innecesariamente
            continue
        time.sleep(1)
        global particulas_agregadas
        particulas_agregadas = calles.agregar_particulas_inicio(id, p=0.6)
        if len(particulas_agregadas) != 0:
            id = particulas_agregadas[-1].id + 1
        calles.update_secuencial(0.5)
        calles.delete_particulas_posicion(size)

simulation_thread = threading.Thread(target=run_simulation, args=(calles,))
simulation_thread.start()

@app.route('/update_data', methods=['POST'])
def update_data():
    global size, isStart, simulation_paused
    data = request.json
    extreme_points = data['calles']
    size = data['size']
    isStart = data['isStart']
    isClear = data['isClear']
    print(isClear)
    if isStart:
        simulation_paused.set()  # Reanudar la simulación
    else:
        simulation_paused.clear()  # Pausar la simulación

    if isClear or len(calles.calles) == 0:
        calles.vaciar_objeto()
        for extreme_point in extreme_points:
            direccion, posicion = extreme_point.split(";")
            calle = Calle(direccion=int(direccion), intersecciones=[], posicion=int(posicion))
            calles.add_calle(calle)
        calles.update_intersecciones()
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/state', methods=['GET'])
def get_state():
    global isStart
    if not isStart:
        return jsonify({"status": "paused", "message": "Simulation is paused"})
    
    diccionario_particulas_agregadas = {}
    for particula in particulas_agregadas:
        direccion = particula.calle.direccion
        if direccion == 0:
            color = 'yellow'
            fila = particula.calle.posicion
            columna = particula.posicion
        else:
            color = 'red'
            columna = particula.calle.posicion
            fila = particula.posicion
        diccionario_particulas_agregadas[particula.id] = {
            'row': fila,
            'col': columna,
            'color': color,
            'id': particula.id
        }
    particulas = calles.get_particulas()
    diccionario_particulas = {}
    for particula in particulas:
        direccion = particula.calle.direccion
        if direccion == 0:
            columna = particula.calle.posicion
            fila = particula.posicion
        else:
            fila = particula.calle.posicion
            columna = particula.posicion
        if columna <= size and fila <= size:
            diccionario_particulas[particula.id] = {
                'id': particula.id,
                'new_row': fila,
                'new_col': columna
            }
    #print(diccionario_particulas, diccionario_particulas_agregadas)
    return jsonify({
        "particulas": diccionario_particulas,
        "particulas_agregadas": diccionario_particulas_agregadas
    })

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
