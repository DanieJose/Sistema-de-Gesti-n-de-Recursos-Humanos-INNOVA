<template>
  <div class="min-h-screen bg-gray-100 flex font-sans">
    <aside class="w-64 bg-slate-800 text-white flex flex-col shadow-xl fixed h-full z-10">
      <div class="p-6 text-2xl font-bold border-b border-slate-700 tracking-tight text-blue-400 uppercase">
        RRHH Innova
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <div v-for="item in menuUsuario" :key="item.ruta">
          <NuxtLink :to="item.ruta" 
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 group"
            active-class="bg-blue-600 shadow-lg">
            <span class="text-xl group-hover:scale-110 transition-transform">{{ item.icono }}</span>
            <span class="text-sm font-medium">{{ item.nombre }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-700 bg-slate-900/50">
        <div class="mb-4 px-2 flex flex-col">
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nivel de Acceso</span>
          <span class="text-xs font-bold text-blue-400">{{ rolNombre }}</span>
        </div>
        <button @click="logout" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8 flex justify-center">
      <div class="w-full max-w-4xl">
        <header class="mb-8 flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight uppercase">Registrar Vacaciones</h1>
            <p class="text-slate-500 mt-1 font-medium italic">Gestión de vacaciones para los empleados.</p>
          </div>
        </header>

        <div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8">
          <div class="mb-6">
            <label class="block text-xs font-black text-slate-500 uppercase mb-2">Seleccionar Empleado</label>
            <select v-model="empleadoSeleccionado" class="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="null">Seleccione un empleado...</option>
              <option v-for="emp in listaEmpleados" :key="emp.id" :value="emp">
                {{ emp.nombre }} {{ emp.apellido }} - {{ emp.identidad }}
              </option>
            </select>
          </div>

          <div v-if="empleadoSeleccionado">
            <h3 class="text-[12px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 border-b pb-2">Datos de Empleado</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase">Empleado</p>
                <p class="font-bold text-slate-800 truncate" :title="`${empleadoSeleccionado.nombre} ${empleadoSeleccionado.apellido}`">
                  {{ empleadoSeleccionado.nombre }} {{ empleadoSeleccionado.apellido }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase">Fecha de Ingreso</p>
                <p class="font-bold text-slate-800">{{ empleadoSeleccionado.fecha_inicio ? new Date(empleadoSeleccionado.fecha_inicio).toLocaleDateString('es-HN') : 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase">Años de laborar</p>
                <p class="font-bold text-slate-800">{{ empleadoSeleccionado.fecha_inicio ? Math.max(0, new Date().getFullYear() - new Date(empleadoSeleccionado.fecha_inicio).getFullYear()) : 0 }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase">Días Correspondientes</p>
                <p class="font-bold text-slate-800">{{ formVacaciones.diasCorrespondientesEmpleado || 14 }}</p>
              </div>
            </div>

            <h3 class="text-[12px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 border-b pb-2">Datos de Vacaciones</h3>
            <form @submit.prevent="guardarVacaciones" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha Solicitud</label>
                  <input type="date" v-model="formVacaciones.fechaSolicitud" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Tipo Solicitud</label>
                  <select v-model="formVacaciones.tipoSolicitud" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required>
                    <option value="">Seleccione...</option>
                    <option value="Normal">Normal</option>
                    <option value="Adelantadas">Adelantadas</option>
                    <option value="Pagadas">Pagadas</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Periodo</label>
                  <input type="text" v-model="formVacaciones.periodo" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Ej. 2023-2024" required>
                </div>
                
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Días Correspondientes (Periodo)</label>
                  <input type="number" v-model="formVacaciones.diasCorrespondientes" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required min="0">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Días Vacaciones (A tomar)</label>
                  <input type="number" v-model="formVacaciones.diasVacaciones" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required min="0">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Días Pagados</label>
                  <input type="number" v-model="formVacaciones.diasPagados" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required min="0">
                </div>
                
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Días Pendientes</label>
                  <input type="number" v-model="formVacaciones.diasPendientes" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required min="0">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha Inicio</label>
                  <input type="date" v-model="formVacaciones.fechaInicio" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha Final</label>
                  <input type="date" v-model="formVacaciones.fechaFinal" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required>
                </div>
                
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Fecha de Regreso</label>
                  <input type="date" v-model="formVacaciones.fechaRegreso" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Autorizado Por</label>
                  <input type="text" v-model="formVacaciones.autorizadoPor" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50" required placeholder="Nombre de quien autoriza">
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Observaciones</label>
                <textarea v-model="formVacaciones.observaciones" rows="3" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 resize-none" placeholder="Opcional..."></textarea>
              </div>
              
              <div class="flex justify-end mt-8 pt-6 border-t border-slate-100 gap-3">
                <button v-if="isEditing" type="button" @click="cancelarEdicion" class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-sm">
                  Cancelar
                </button>
                <button type="submit" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg">
                  {{ isEditing ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>

            <div class="mt-12 pt-8 border-t border-slate-100">
              <h3 class="text-[12px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 border-b pb-2">Historial de Vacaciones</h3>
              <div v-if="vacacionesEmpleado.length === 0" class="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-slate-400 italic shadow-sm">
                No hay registros de vacaciones anteriores para este empleado.
              </div>
              <div v-else class="space-y-4">
                <div v-for="v in vacacionesEmpleado" :key="v.id" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <div class="flex justify-between items-start">
                    <div class="flex gap-2 items-center">
                      <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">Periodo: {{ v.periodo || 'N/A' }}</span>
                      <span v-if="v.tipoSolicitud" class="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200">{{ v.tipoSolicitud }}</span>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="text-right text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p><span class="text-slate-400">Creado por:</span> <span class="text-slate-700">{{ v.creadoPorNombre || 'Admin' }}</span> <span class="mx-2 text-slate-300">|</span> <span class="text-slate-400">Fecha:</span> <span class="text-slate-700">{{ v.fechaCreacion ? new Date(v.fechaCreacion).toLocaleDateString('es-HN') : (v.fecha_creacion ? new Date(v.fecha_creacion).toLocaleDateString('es-HN') : 'N/A') }}</span></p>
                        <p class="mt-1" v-if="(v.fechaModificacion || v.fecha_modificacion) && (v.fechaModificacion || v.fecha_modificacion) !== (v.fechaCreacion || v.fecha_creacion)"><span class="text-slate-400">Modificado:</span> <span class="text-slate-700">{{ v.modificadoPorNombre || v.creadoPorNombre || 's/d' }}</span> <span class="mx-2 text-slate-300">|</span> <span class="text-slate-400">Fecha:</span> <span class="text-slate-700">{{ v.fechaModificacion ? new Date(v.fechaModificacion).toLocaleDateString('es-HN') : new Date(v.fecha_modificacion).toLocaleDateString('es-HN') }}</span></p>
                      </div>
                      <button @click="editarVacacion(v)" class="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 hover:border-blue-600 shadow-sm flex items-center gap-1" title="Editar Vacaciones">
                        <span>✏️</span>
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Días Disfrutados</p>
                      <p class="font-black text-blue-600 text-2xl">{{ v.diasVacaciones || 0 }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Días Pagados</p>
                      <p class="font-black text-emerald-500 text-2xl">{{ v.diasPagados || 0 }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Días Pendientes</p>
                      <p class="font-black text-orange-500 text-2xl">{{ v.diasPendientes || 0 }}</p>
                    </div>
                    <div class="p-3 flex flex-col justify-center items-center md:items-start">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Fecha Inicio</p>
                      <p class="font-bold text-slate-800 text-sm">{{ v.fechaInicio ? new Date(v.fechaInicio).toLocaleDateString('es-HN') : 'N/A' }}</p>
                    </div>
                    <div class="p-3 flex flex-col justify-center items-center md:items-start">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Fecha Final</p>
                      <p class="font-bold text-slate-800 text-sm">{{ v.fechaFinal ? new Date(v.fechaFinal).toLocaleDateString('es-HN') : 'N/A' }}</p>
                    </div>
                  </div>

                  <div v-if="v.observaciones" class="mt-2 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
                    <p class="text-[10px] font-black text-yellow-600 uppercase mb-1">Observaciones</p>
                    <p class="text-sm text-slate-700 font-medium italic">{{ v.observaciones }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-slate-400 italic py-10">
            Seleccione un empleado de la lista para registrar sus vacaciones.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const rolID = ref(null)
const rolNombre = ref('Cargando...')
const menuUsuario = ref([])

const listaEmpleados = ref([])
const empleadoSeleccionado = ref(null)
const vacacionesEmpleado = ref([])

const formVacaciones = ref({
  fechaSolicitud: new Date().toISOString().split('T')[0],
  tipoSolicitud: '',
  periodo: '',
  diasCorrespondientes: 0,
  diasVacaciones: 0,
  diasPagados: 0,
  diasPendientes: 0,
  fechaInicio: '',
  fechaFinal: '',
  fechaRegreso: '',
  observaciones: '',
  autorizadoPor: '',
  diasCorrespondientesEmpleado: 14 // Ejemplo
})

const cargarVacaciones = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/vacaciones/empleado/${id}`)
    vacacionesEmpleado.value = res.data
  } catch (error) {
    console.error('Error al cargar historial de vacaciones:', error)
  }
}

watch(empleadoSeleccionado, async (nuevoEmpleado) => {
  if (nuevoEmpleado) {
    await cargarVacaciones(nuevoEmpleado.id)
    if (route.query.editar) {
      const vId = Number(route.query.editar)
      const foundV = vacacionesEmpleado.value.find(v => v.id === vId)
      if (foundV) {
        editarVacacion(foundV)
        // Limpiamos la URL para no volver a entrar si cambia de empleado
        router.replace({ query: { empleadoId: route.query.empleadoId } })
      }
    }
  } else {
    vacacionesEmpleado.value = []
  }
})

const logout = () => {
  localStorage.clear()
  navigateTo('/login')
}

const isEditing = ref(false)
const vacacionEditId = ref(null)

const editarVacacion = (v) => {
  isEditing.value = true
  vacacionEditId.value = v.id
  formVacaciones.value = {
    fechaSolicitud: v.fechaSolicitud ? new Date(v.fechaSolicitud).toISOString().split('T')[0] : '',
    tipoSolicitud: v.tipoSolicitud || '',
    periodo: v.periodo || '',
    diasCorrespondientes: v.diasCorrespondientes || 0,
    diasVacaciones: v.diasVacaciones || 0,
    diasPagados: v.diasPagados || 0,
    diasPendientes: v.diasPendientes || 0,
    fechaInicio: v.fechaInicio ? new Date(v.fechaInicio).toISOString().split('T')[0] : '',
    fechaFinal: v.fechaFinal ? new Date(v.fechaFinal).toISOString().split('T')[0] : '',
    fechaRegreso: v.fechaRegreso ? new Date(v.fechaRegreso).toISOString().split('T')[0] : '',
    observaciones: v.observaciones || '',
    autorizadoPor: v.autorizadoPor || '',
    diasCorrespondientesEmpleado: v.diasCorrespondientesEmpleado || 14
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelarEdicion = () => {
  isEditing.value = false
  vacacionEditId.value = null
  formVacaciones.value = {
    fechaSolicitud: new Date().toISOString().split('T')[0],
    tipoSolicitud: '',
    periodo: '',
    diasCorrespondientes: 0,
    diasVacaciones: 0,
    diasPagados: 0,
    diasPendientes: 0,
    fechaInicio: '',
    fechaFinal: '',
    fechaRegreso: '',
    observaciones: '',
    autorizadoPor: '',
    diasCorrespondientesEmpleado: 14
  }
}

const guardarVacaciones = async () => {
  if (!empleadoSeleccionado.value) {
    alert('❌ Debe seleccionar un empleado')
    return
  }

  try {
    const payload = {
      empleado_id: empleadoSeleccionado.value.id,
      fechaIngreso: empleadoSeleccionado.value.fecha_inicio,
      aniosLaborados: empleadoSeleccionado.value.fecha_inicio ? Math.max(0, new Date().getFullYear() - new Date(empleadoSeleccionado.value.fecha_inicio).getFullYear()) : 0,
      diasCorrespondientesEmpleado: formVacaciones.value.diasCorrespondientesEmpleado,
      fechaSolicitud: formVacaciones.value.fechaSolicitud,
      tipoSolicitud: formVacaciones.value.tipoSolicitud,
      periodo: formVacaciones.value.periodo,
      diasCorrespondientes: formVacaciones.value.diasCorrespondientes,
      diasVacaciones: formVacaciones.value.diasVacaciones,
      diasPagados: formVacaciones.value.diasPagados,
      diasPendientes: formVacaciones.value.diasPendientes,
      fechaInicio: formVacaciones.value.fechaInicio,
      fechaFinal: formVacaciones.value.fechaFinal,
      fechaRegreso: formVacaciones.value.fechaRegreso,
      observaciones: formVacaciones.value.observaciones,
      autorizadoPor: formVacaciones.value.autorizadoPor,
      usuario_id: localStorage.getItem('usuarioID')
    }

    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/vacaciones/${vacacionEditId.value}`, payload)
      alert('✅ Vacaciones actualizadas correctamente')
    } else {
      await axios.post('http://localhost:3000/api/vacaciones/registrar', payload)
      alert('✅ Vacaciones registradas correctamente en la Base de Datos')
    }
    
    await cargarVacaciones(empleadoSeleccionado.value.id)
    cancelarEdicion()
  } catch (error) {
    console.error('Error al registrar/actualizar vacaciones:', error)
    alert('❌ Error al procesar las vacaciones: ' + (error.response?.data?.error || error.message))
  }
}

onMounted(async () => {
  rolID.value = localStorage.getItem('usuarioRol') || 2
  if (rolID.value == 1) {
    rolNombre.value = 'Administrador IT'
  } else if (rolID.value == 2) {
    rolNombre.value = 'Recursos Humanos'
  } else {
    rolNombre.value = 'Empleado'
  }

  try {
    const m = await axios.get(`http://localhost:3000/api/menu/${rolID.value}`)
    menuUsuario.value = m.data
  } catch (e) {
    console.error('Error cargando menú', e)
  }

  try {
    const res = await axios.get('http://localhost:3000/api/empleados/lista', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
    listaEmpleados.value = res.data

    if (route.query.empleadoId) {
      const empId = Number(route.query.empleadoId)
      const foundEmp = listaEmpleados.value.find(e => e.id === empId)
      if (foundEmp) {
        empleadoSeleccionado.value = foundEmp
      }
    }
  } catch (error) {
    console.error("Error cargando los empleados:", error)
  }
})
</script>