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
size = 40
isStart = False
mode = 'paralelo'
simulation_running = True
step = 5
cantidad_inicial = 100
simulation_paused = threading.Event()
simulation_paused.set()
velocidad = 0.5
lock = threading.Lock()  # Añadir un Lock para sincronización

def run_simulation(calles):
    while simulation_running:
        with lock:
            current_is_start = isStart
            current_mode = mode
            current_velocidad = velocidad
        simulation_paused.wait()  # Espera si está en pausa
        
        print(f"isStart: {current_is_start}")  # Log de depuración
        print(f"simulation_paused: {simulation_paused.is_set()}")  # Log de depuración
        if not current_is_start:
            print("Simulation not started yet...")  # Log de depuración
            time.sleep(0.1)  # Pequeña pausa para no consumir CPU innecesariamente
            continue
        time.sleep(1.3 - current_velocidad)
        print("Running simulation step...")  # Log de depuración
        calles.update_bloqueos()
        if current_mode == 'secuencial':
            calles.update_secuencial(0.5)
        else:
            calles.update_paralelo(0.5)

simulation_thread = threading.Thread(target=run_simulation, args=(calles,))
simulation_thread.start()

@app.route('/update_data', methods=['POST'])
def update_data():
    global size, isStart, simulation_paused, mode, step, cantidad_inicial, ultimo_id, particulas_agregadas, velocidad
    data = request.json
    extreme_points = data['calles']
    size = data['size']
    with lock:
        isStart = data['isStart']
        mode = data['mode']
        step = data['step']
        cantidad_inicial = data['cantidad_inicial']
        velocidad = data['velocidad']
    isClear = data['isClear']
    density_init = data['densityInit']

    #print(f"isStart received: {isStart}")  # Log de depuración
    #print(f"step: {step}, cantidad_inicial: {cantidad_inicial}, velocidad: {velocidad}")  # Log de depuración
    with lock:
        if isStart:
            simulation_paused.clear()  # Reanudar la simulación
            #print(f"Simulation resumed: {simulation_paused.is_set()}")  # Log de depuración
        else:
            simulation_paused.set()  # Pausar la simulación
            #print(f"simulation Paused: {simulation_paused.is_set()}") # Log de depuración

    if isClear or len(calles.calles) == 0:
        calles.vaciar_objeto()
        ultimo_id = 0
        particulas_agregadas = []
        for extreme_point in extreme_points:
            direccion, posicion = extreme_point.split(";")
            calle = Calle(direccion=int(direccion), intersecciones=[], posicion=int(posicion))
            # Densidad
            posicion = density_init
            for _ in range(cantidad_inicial):

                se_puede_poner = True

                for otra_calle in calles.calles:
                    if otra_calle.posicion == posicion and otra_calle.direccion == 1 - int(direccion):
                        se_puede_poner = False

                if se_puede_poner:
                    particula = Particula(id=ultimo_id, posicion=posicion, calle=calle, bloqueado=True)
                    calle.insert(0, particula)
                    particulas_agregadas.append(particula)
                    ultimo_id += 1

                posicion -= step
            calle.iniciar_altura(-size * 2, size * 2)
            calle.update_bloqueo()
            calles.add_calle(calle)
            calles.update_intersecciones()
        calles.update_intersecciones()
    return jsonify({"status": "success", "message": "Data received successfully"})

@app.route('/state', methods=['GET'])
def get_state():
    global isStart
    with lock:
        current_is_start = isStart
    if not current_is_start:
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
        if columna <= size and fila <= size:
            diccionario_particulas[particula.id] = {
                'id': particula.id,
                'new_row': fila,
                'new_col': columna
            }

    diccionario_funcion_altura = {str(x) + ',' + str(y): 0 for x in range(size + 1) for y in range(size + 1)}

    for calle in calles.calles:
        calle.actualizar_altura()
        direccion = calle.direccion
        intersecciones = {interseccion.posicion: interseccion.calles for interseccion in calle.intersecciones}
        if direccion == 0:
            y = calle.posicion
            for x in range(size + 1):
                if (x, y) in intersecciones.keys():
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = max(intersecciones[(x, y)][1].altura[y], calle.altura[x])
                else:
                    diccionario_funcion_altura[str(x) + ',' + str(y)] = calle.altura[x]
        else:
            x = calle.posicion
            for y in range(size + 1):
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
    print("Starting Flask app...")  # Log de depuración
    app.run(debug=True, use_reloader=False)
