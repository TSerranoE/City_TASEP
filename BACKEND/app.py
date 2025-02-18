from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

from Calle import Calle
from Interseccion import Interseccion
from Particula import Particula
from Calles import Calles

calles = Calles([])

particulas_agregadas = []
ultimo_id = 0

class SimulationState:
    def __init__(self):
        self.size = 40
        self.isStart = False
        self.mode = 'paralelo'
        self.simulation_running = True
        self.step = 5
        self.cantidad_inicial = 100
        self.simulation_paused = threading.Event()
        self.simulation_paused.set()
        self.velocidad = 0.5
        self.lock = threading.Lock()

    def set_start(self, value):
        with self.lock:
            self.isStart = value
            if value:
                self.simulation_paused.set()  # Reanudar la simulación
            else:
                self.simulation_paused.clear()  # Pausar la simulación

    def get_start(self):
        with self.lock:
            return self.isStart

    def set_mode(self, value):
        with self.lock:
            self.mode = value

    def get_mode(self):
        with self.lock:
            return self.mode

    def set_velocidad(self, value):
        with self.lock:
            self.velocidad = value

    def get_velocidad(self):
        with self.lock:
            return self.velocidad

simulation_state = SimulationState()

def run_simulation(calles, simulation_state):
    while simulation_state.simulation_running:
        simulation_state.simulation_paused.wait()  # Espera si está en pausa
        if not simulation_state.get_start():
            time.sleep(0.1)  # Pequeña pausa para no consumir CPU innecesariamente
            continue
        time.sleep(1.3 - simulation_state.get_velocidad())

        calles.update_bloqueos()
        if simulation_state.get_mode() == 'secuencial':
            calles.update_secuencial(0.5)
        else:
            calles.update_paralelo(0.5)

simulation_thread = threading.Thread(target=run_simulation, args=(calles, simulation_state))
simulation_thread.start()

@app.route('/update_data', methods=['POST'])
def update_data():
    global size, ultimo_id, particulas_agregadas
    data = request.json
    extreme_points = data['calles']
    simulation_state.size = data['size']
    simulation_state.set_start(data['isStart'])
    isClear = data['isClear']
    simulation_state.set_mode(data['mode'])
    simulation_state.step = data['step']
    simulation_state.cantidad_inicial = data['cantidad_inicial']
    simulation_state.set_velocidad(data['velocidad'])
    density_init = data['densityInit']

    if isClear or len(calles.calles) == 0:
        calles.vaciar_objeto()
        ultimo_id = 0
        particulas_agregadas = []
        for extreme_point in extreme_points:
            direccion, posicion = extreme_point.split(";")
            calle = Calle(direccion=int(direccion), intersecciones=[], posicion=int(posicion))
            # Densidad 
            posicion = density_init
            for _ in range(simulation_state.cantidad_inicial):
                se_puede_poner = True
                for otra_calle in calles.calles:
                    if otra_calle.posicion == posicion and otra_calle.direccion == 1 - int(direccion):
                        se_puede_poner = False

                if se_puede_poner:
                    particula = Particula(id=ultimo_id, posicion=posicion, calle=calle, bloqueado=True)
                    calle.insert(0, particula)
                    particulas_agregadas.append(particula)
                    ultimo_id += 1

                posicion -= simulation_state.step
            calle.iniciar_altura(-simulation_state.size * 2, simulation_state.size * 2)
            calle.update_bloqueo()
            calles.add_calle(calle)
            calles.update_intersecciones()
        calles.update_intersecciones()
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/state', methods=['GET'])
def get_state():
    if not simulation_state.get_start():
        return jsonify({"status": "paused", "message": "Simulation is paused"})

    diccionario_particulas_agregadas = {}
    for particula in particulas_agregadas:
        direccion = particula.calle.direccion
        if direccion == 0:
            color = 'yellow'
            columna = particula.calle.posicion
            fila = particula.posicion
        else:
            color = 'red'
            fila = particula.calle.posicion
            columna = particula.posicion
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
        if columna <= simulation_state.size and fila <= simulation_state.size:
            diccionario_particulas[particula.id] = {
                'id': particula.id,
                'new_row': fila,
                'new_col': columna
            }

    diccionario_funcion_altura = {str(x) + ',' + str(y): 0 for x in range(simulation_state.size + 1) for y in range(simulation_state.size + 1)}

    for calle in calles.calles:
        calle.actualizar_altura()
        direccion = calle.direccion
        intersecciones = {interseccion.posicion: interseccion.calles for interseccion in calle.intersecciones}
        if direccion == 0:
            y = calle.posicion
            for x in range(simulation_state.size + 1):
                if (x, y) in intersecciones.keys():
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = max(intersecciones[(x, y)][1].altura[y], calle.altura[x])
                else:
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = calle.altura[x]
        else:
            x = calle.posicion
            for y in range(simulation_state.size + 1):
                if (x, y) in intersecciones.keys():
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = max(intersecciones[(x, y)][0].altura[x], calle.altura[y])
                else:
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = calle.altura[y]

    return jsonify({
        "particulas": diccionario_particulas,
        "particulas_agregadas": diccionario_particulas_agregadas,
        "diccionario_funcion_altura": diccionario_funcion_altura
    })

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
