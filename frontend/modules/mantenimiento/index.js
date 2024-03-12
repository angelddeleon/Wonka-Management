// Display de las máquinas y su mantenimiento al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const machines = await getMachines().then((json) => { return json.machines })
  console.log(machines)
  displayMachines(machines)
  displayMaintenance(machines)
})

// Obtener el array de las máquinas
async function getMachines () {
  const response = await fetch('http://localhost:3000/api/mantenimiento/')
  return response.json()
}

// Actualizar el display de las máquinas
function displayMachines (machines) {
  // Obtener los contenedores de las máquinas
  const chocolateras = document.getElementById('chocolateras')
  const caramelizadoras = document.getElementById('caramelizadoras')
  const carameleras = document.getElementById('carameleras')
  const chicleras = document.getElementById('chicleras')

  // Obtener contenedor de los números de máquinas
  const dataGrid = document.getElementById('grid')

  // Limpiar cada contenedor antes de añadir las máquinas
  chocolateras.innerHTML = ''
  caramelizadoras.innerHTML = ''
  carameleras.innerHTML = ''
  chicleras.innerHTML = ''
  dataGrid.innerHTML = `<div class="grid-item"></div>
                        <div class="grid-item">Chocolateras</div>
                        <div class="grid-item">Caramelizadoras</div>
                        <div class="grid-item">Carameleras</div>
                        <div class="grid-item">Chicleras</div>`

  // Crear colección de máquinas por tipo
  const choco = {
    uso: 0,
    disponible: 0,
    notificada: 0,
    mantenimiento: 0,
    defectuosa: 0
  }

  const cara = structuredClone(choco)
  const caramel = structuredClone(choco)
  const chicl = structuredClone(choco)

  // Crear grid de números por tipo de máquina
  let grid = []
  const total = []

  // Añadir máquinas según su tipo
  machines.forEach((machine) => {
    switch (machine.type) {
      case 'chocolatera':
        choco[machine.state] += 1
        break
      case 'caramelizadora':
        cara[machine.state] += 1
        break
      case 'caramelera':
        caramel[machine.state] += 1
        break
      case 'chiclera':
        chicl[machine.state] += 1
        break
    }
  })

  // Agrupar contenedores y tipos de máquinas para iterar
  const col = [[chocolateras, choco], [caramelizadoras, cara], [carameleras, caramel], [chicleras, chicl]]

  // Display de las máquinas en orden
  col.forEach((set) => {
    const [container, type] = set
    for (const state in type) {
      container.innerHTML += `<div class='square ${state}'></div>`.repeat(type[state])
    }
    // Añadir valores al grid
    const values = Object.values(type)
    grid.push(values)
    total.push(values.reduce((a, b) => a + b, 0))
  })

  // Display de los números en orden
  // Trasponer grid para iterar por columnas y agregar total de máquinas por tipo
  grid = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
  grid.push(total)

  // Iterar para añadir datos al data_grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = -1; j < grid[i].length; j++) {
      if (j === -1) {
        switch (i) {
          case 0:
            dataGrid.innerHTML += '<p style="color: #9f70fd;" class="first-item">En uso </p>'
            break
          case 1:
            dataGrid.innerHTML += '<p style="color: #42c087;" class="first-item">Disponibles </p>'
            break
          case 2:
            dataGrid.innerHTML += '<p style="color: #f17c37;" class="first-item">Notificadas</p>'
            break
          case 3:
            dataGrid.innerHTML += '<p style="color: #f1c40f;" class="first-item"> Mantenimiento</p>'
            break
          case 4:
            dataGrid.innerHTML += '<p style="color: #e74c3c;" class="first-item">Defectuosas</p>'
            break
          case 5:
            dataGrid.innerHTML += '<p style="color: #34495e;" class="first-item">Total</p>'
            break
        }
      } else {
        dataGrid.innerHTML += `<div class='grid-item'>${grid[i][j]}</div>`
      }
    }
  }
}

function displayMaintenance (machines) {
  // Obtener el contenedor de las máquinas en mantenimiento
  const planificado = document.getElementById('planificado')
  const realizando = document.getElementById('realizando')
  const planificacion = []; const realizacion = []

  // Limpiar contenedores antes de añadir los mantenimientos
  planificado.innerHTML = '<h3> Planificado </h3>'
  realizando.innerHTML = '<h3> Realizando </h3>'

  // Obtener la fecha actual
  const date = new Date()
  date.setHours(11, 59, 59, 999)

  // Obtener máquinas con mantenimiento
  machines.forEach((machine) => {
    if (machine.typeMaintenance !== null) {
      // Obtener fechas de mantenimiento
      machine.dateMaintenance = new Date(machine.dateMaintenance)
      machine.dateAvailability = new Date(machine.dateAvailability)

      // Agrupar máquinas según fecha de mantenimiento
      // Si es menor que la fecha actual o no la tiene, se está realizando
      if (machine.dateMaintenance < date || machine.dateMaintenance === null) {
        realizacion.push(machine)
      } else {
        planificacion.push(machine)
      }
    }
  })

  // Sortear máquinas por fecha de mantenimiento
  planificacion.sort((a, b) => a.dateMaintenance - b.dateMaintenance)
  realizacion.sort((a, b) => a.dateAvailability - b.dateAvailability)

  // Agregar máquinas a su contenedor correspondiente
  planificacion.forEach((machine) => {
    const days = Math.ceil((machine.dateMaintenance - date) / (1000 * 60 * 60 * 24))
    const tag = `<div class="state-container">
                      <div class="state ${machine.typeMaintenance}">${machine.id}</div>
                      <div class="state-info">Mantenimiento en ${days} día(s)</div>
                 </div>`
    planificado.innerHTML += tag
  })

  realizacion.forEach((machine) => {
    const days = Math.ceil((machine.dateAvailability - date) / (1000 * 60 * 60 * 24))
    const tag = `<div class="state-container">
                      <div class="state ${machine.typeMaintenance}">${machine.id}</div>
                      <div class="state-info">Disponible en ${days} día(s)</div>
                 </div>`
    realizando.innerHTML += tag
  })
}

// Añadir máquinas
const addForm = document.getElementById('add').children[0]
// Evento al enviar el formulario
addForm.addEventListener('submit', async (e) => {
  // Evitar que se recargue la página
  e.preventDefault()
  // Obtener el tipo de máquina del formulario y cantidad
  const tipo = document.getElementById('tipo-select').value.toLowerCase()
  const id = document.getElementById('id-maquina').value
  const machines = await getMachines().then((json) => { return json.machines })
  let valid = false

  // Validar id entre las máquinas
  machines.forEach((machine) => {
    if (machine.id === id) {
      valid = true
    }
  })

  // Crear máquina con tipo dado en la base de datos
  if (valid) {
    try {
      for (let i = 0; i < cantidad; i++) {
        const response = await fetch('http://localhost:3000/api/mantenimiento/machine/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id, type: tipo })
        })
      }
      alert(`Máquina ${id} tipo ${tipo} añadida`)
  
      // Actualizar las máquinas visibles
      displayMachines()
    } catch(error) {
      console.error(error)
      alert('Error al añadir máquina, revise la consola y/o servidor')
    }
  } else {
    alert('Id de máquina ya asignada, por favor ingrese un id diferente')
  }
})

// Eliminar máquinas
const deleteForm = document.getElementById('delete').children[0]
// Evento al enviar el formulario
deleteForm.addEventListener('submit', async (e) => {
  // Evitar que se recargue la página
  e.preventDefault()


  // Display datos de la máquina a eliminar

  // Obtener el id de la máquina del formulario
  const id = document.getElementById('id-delete').value

  // Validar id entre las máquinas


  /*
  // Eliminar máquina con id dado en la base de datos
  const response = await fetch(`http://localhost:3000/api/mantenimiento/machine/${id}`, {
    method: 'DELETE'
  }).then(() => {alert(`Máquina ${id} eliminada`)})
  console.log(response)

  // Actualizar las máquinas visibles
  displayMachines(await getMachines().then((json) => { return json.machines }))
  */
})


// obtener los botones de abrir y cerrar
const btns = document.querySelectorAll('.btn-open')
const btnsClose = document.querySelectorAll('.close-button')

// recorrer los botones de abrir y agregar el evento click
btns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const dialog = document.getElementById(btn.value)
    dialog.classList.remove('close')
    dialog.classList.add('open')
    dialog.showModal()
  })
})

// recorrer los botones de cerrar y agregar el evento click
btnsClose.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    const dialog = document.getElementById(e.target.parentElement.parentElement.parentElement.id)
    dialog.classList.remove('open')
    dialog.classList.add('close')

    const close = () => {
      dialog.close()
      dialog.removeEventListener('animationend', close)
    }

    dialog.addEventListener('animationend', close)
  })
}
)
