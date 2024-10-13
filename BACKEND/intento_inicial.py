from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import time
import threading
#%pip install flask flask_cors
app = Flask(__name__)
CORS(app)

class Particula:
    def __init__(self, posicion: int, bloqueado: bool, color: str) -> None:
        self.posicion = posicion
        self.bloqueado = bloqueado
        self.color = color
    def avanzar(self) -> None:
        self.posicion += 1

class Calle(list):
    def __init__(self, *args) -> None:
        super().__init__(*args)

    def agregar_particula_inicio(self) -> None:
        self.insert(0, Particula(0, self[0].posicion == 1))

    def update_bloqueo_casilla(self, i: int) -> None:
        self[i].bloqueado = self[i+1].posicion == self[i].posicion + 1

    def update_bloqueo(self) -> None:
        for i in range(len(self) - 1):
            self.update_bloqueo_casilla(i)
    
    def update_secuencial(self, p: float) -> None:
        for i in range(len(self)-1, -1, -1):
            if not self[i].bloqueado and np.random.rand() < p:
                self[i].avanzar()
                if i != len(self) - 1:
                    self.update_bloqueo_casilla(i)
                if i != 0:
                    self[i-1].bloqueado = False

    def update_paralelo(self, p: float) -> None:
        for i in range(len(self)-1, -1, -1):
            if not self[i].bloqueado:
                if np.random.rand() < p:
                    self[i].avanzar()
        self.update_bloqueo()
colores = ["negro", "azul", "rojo", "amarillo", "verde"]
class CityTASEP:
    def __init__(self, size, p, initial_positions):
        self.size = size
        self.p = p
        self.calle = Calle([Particula(pos, False, color=np.random.choice(colores)) for pos in initial_positions])
    
    
    def step(self):
        self.calle.update_paralelo(self.p)
        
    def get_posiciones(self):
        return [(particle.posicion, particle.color) for particle in self.calle]

# Example usage with initial positions
initial_positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]  # Specify initial positions of particles
simulation = CityTASEP(50, 0.5, initial_positions)  # Create a street of length 50 with p=0.5

def run_simulation():
    while True:
        simulation.step()
        time.sleep(0.5)  

# Start the simulation in a separate thread
simulation_thread = threading.Thread(target=run_simulation)
simulation_thread.start()

@app.route('/state')
def get_state():
    return jsonify(simulation.get_posiciones())

if __name__ == '__main__':
    app.run(debug=True)