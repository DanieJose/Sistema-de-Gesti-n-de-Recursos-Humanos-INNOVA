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

    <main class="flex-1 ml-64 p-8">
      <header class="mb-8 flex flex-col gap-5 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex justify-between items-center w-full">
          <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight uppercase">Módulo de Reportes</h1>
            <p class="text-slate-500 mt-1 font-medium italic">Vista general y gestión de departamentos.</p>
          </div>
        </div>
      </header>

      <!-- Pestañas -->
      <div class="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        <button 
          v-for="tab in ['RESUMEN EJECUTIVO', 'DEPARTAMENTOS']" 
          :key="tab"
          @click="activeTab = tab"
          class="px-5 py-2.5 rounded-t-xl font-bold text-xs uppercase tracking-widest transition-all border-b-2"
          :class="activeTab === tab ? 'bg-blue-50 text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab: RESUMEN EJECUTIVO -->
      <div v-if="activeTab === 'RESUMEN EJECUTIVO'" class="space-y-6">
        <div v-if="loadingStats" class="bg-white rounded-3xl shadow-sm border border-slate-100 p-20 text-center text-slate-400 italic">
          Cargando estadísticas...
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow">
            <span class="text-3xl">👥</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Empleados</p>
            <p class="text-4xl font-black text-slate-800">{{ stats.total || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow border-t-4 border-t-emerald-500">
            <span class="text-3xl">✅</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activos</p>
            <p class="text-4xl font-black text-emerald-600">{{ stats.activos || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow border-t-4 border-t-red-500">
            <span class="text-3xl">🛑</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inactivos</p>
            <p class="text-4xl font-black text-red-600">{{ stats.inactivos || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
            <span class="text-3xl">🏢</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departamentos</p>
            <p class="text-4xl font-black text-blue-600">{{ stats.categorias || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow">
            <span class="text-3xl">🎂</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumpleañeros del Mes</p>
            <p class="text-4xl font-black text-purple-600">{{ stats.cumpleaneros || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow">
            <span class="text-3xl">📄</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venc. de Contratos (30d)</p>
            <p class="text-4xl font-black text-orange-600">{{ stats.vencimientos || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow">
            <span class="text-3xl">🎫</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tickets Pendientes</p>
            <p class="text-4xl font-black text-yellow-600">{{ stats.tickets || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Tab: DEPARTAMENTOS -->
      <div v-if="activeTab === 'DEPARTAMENTOS'" class="space-y-6">
        <div class="flex justify-between items-center w-full mb-4">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar departamento..." 
            class="w-full max-w-md p-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:italic shadow-sm"
          >
          <button @click="abrirModalCrear" class="bg-green-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2">
            <span>+</span> Crear Nuevo
          </button>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departamento</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Creado Por</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Creación</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modificado Por</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Modificación</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingDept" class="border-b border-slate-50">
                <td colspan="7" class="p-10 text-center text-slate-400 italic">Cargando departamentos...</td>
              </tr>
              <tr v-else-if="filteredDepartamentos.length === 0" class="border-b border-slate-50">
                <td colspan="7" class="p-10 text-center text-slate-400 italic">No se encontraron departamentos.</td>
              </tr>
              <tr v-else v-for="dept in filteredDepartamentos" :key="dept.id" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td class="p-5 font-bold text-slate-800">{{ dept.nombre }}</td>
                <td class="p-5">
                  <span :class="dept.estado ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'" class="px-3 py-1 text-[10px] font-black uppercase rounded-full border">
                    {{ dept.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="p-5 text-sm text-slate-600">{{ dept.creado_por || 'N/A' }}</td>
                <td class="p-5 text-sm text-slate-500">{{ dept.fecha_creacion ? new Date(dept.fecha_creacion).toLocaleDateString('es-HN') : 'N/A' }}</td>
                <td class="p-5 text-sm text-slate-600">{{ dept.modificado_por || 'N/A' }}</td>
                <td class="p-5 text-sm text-slate-500">{{ dept.ultima_modificacion ? new Date(dept.ultima_modificacion).toLocaleDateString('es-HN') : 'N/A' }}</td>
                <td class="p-5 text-center flex justify-center gap-2">
                  <button @click="abrirModalEditar(dept)" class="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-lg text-xs font-bold transition-colors border border-blue-200 hover:border-blue-600" title="Editar">
                    ✏️
                  </button>
                  <button @click="toggleEstado(dept)" :class="dept.estado ? 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600' : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 hover:border-green-600'" class="p-2 rounded-lg text-xs font-bold transition-colors" :title="dept.estado ? 'Desactivar' : 'Activar'">
                    {{ dept.estado ? '🛑' : '✅' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Crear/Editar Departamento -->
      <div v-if="mostrarModalDept" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
          <div class="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">{{ esEdicion ? 'Editar Departamento' : 'Crear Departamento' }}</h2>
              <p class="text-xs text-slate-500 font-medium italic mt-1">Gestión de estructura</p>
            </div>
            <button @click="cerrarModal" class="text-slate-400 hover:text-red-500 p-2 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors">&times;</button>
          </div>
          
          <div class="p-8">
            <form @submit.prevent="guardarDepartamento" class="space-y-5">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nombre del Departamento</label>
                <input type="text" v-model="formDept.nombre" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-blue-500 transition-all placeholder-slate-300" placeholder="Ej. Recursos Humanos">
              </div>
              
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Descripción</label>
                <textarea v-model="formDept.descripcion" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-blue-500 transition-all placeholder-slate-300 resize-none" placeholder="Opcional..."></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" @click="cerrarModal" class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                  {{ esEdicion ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const rolID = ref(null)
const rolNombre = ref('Cargando...')
const menuUsuario = ref([])
const usuarioActual = ref('')

const activeTab = ref('RESUMEN EJECUTIVO')

// Stats
const stats = ref({})
const loadingStats = ref(true)

// Departamentos
const departamentos = ref([])
const loadingDept = ref(true)
const searchQuery = ref('')
const mostrarModalDept = ref(false)
const esEdicion = ref(false)
const formDept = ref({ id: null, nombre: '', descripcion: '' })

const filteredDepartamentos = computed(() => {
  if (!searchQuery.value) return departamentos.value;
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return departamentos.value.filter(d => 
    d.nombre.toLowerCase().includes(lowerCaseQuery) || 
    (d.descripcion && d.descripcion.toLowerCase().includes(lowerCaseQuery))
  );
})

const cargarStats = async () => {
  try {
    loadingStats.value = true
    const res = await axios.get('http://localhost:3000/api/stats/resumen')
    stats.value = res.data
  } catch (error) {
    console.error('Error cargando estadísticas', error)
  } finally {
    loadingStats.value = false
  }
}

const cargarDepartamentos = async () => {
  try {
    loadingDept.value = true
    const res = await axios.get('http://localhost:3000/api/departamentos/lista')
    departamentos.value = res.data
  } catch (error) {
    console.error('Error cargando departamentos', error)
  } finally {
    loadingDept.value = false
  }
}

const abrirModalCrear = () => {
  esEdicion.value = false
  formDept.value = { id: null, nombre: '', descripcion: '' }
  mostrarModalDept.value = true
}

const abrirModalEditar = (dept) => {
  esEdicion.value = true
  formDept.value = { id: dept.id, nombre: dept.nombre, descripcion: dept.descripcion }
  mostrarModalDept.value = true
}

const cerrarModal = () => {
  mostrarModalDept.value = false
}

const guardarDepartamento = async () => {
  try {
    const payload = {
      nombre: formDept.value.nombre,
      descripcion: formDept.value.descripcion,
      creado_por: usuarioActual.value,
      modificado_por: usuarioActual.value
    }

    if (esEdicion.value) {
      await axios.put(`http://localhost:3000/api/departamentos/editar/${formDept.value.id}`, payload)
      alert('✅ Departamento actualizado exitosamente')
    } else {
      await axios.post(`http://localhost:3000/api/departamentos/crear`, payload)
      alert('✅ Departamento creado exitosamente')
    }
    cerrarModal()
    cargarDepartamentos()
    cargarStats() // Refresh stats since departments count might have changed
  } catch (error) {
    console.error('Error al guardar', error)
    alert('❌ Error al guardar el departamento')
  }
}

const toggleEstado = async (dept) => {
  const nuevoEstado = dept.estado ? 0 : 1
  const accion = dept.estado ? 'desactivar' : 'activar'
  if (!confirm(`¿Está seguro que desea ${accion} el departamento ${dept.nombre}?`)) return

  try {
    await axios.put(`http://localhost:3000/api/departamentos/estado/${dept.id}`, {
      estado: nuevoEstado,
      modificado_por: usuarioActual.value
    })
    cargarDepartamentos()
  } catch (error) {
    console.error('Error al cambiar estado', error)
    alert('❌ Error al cambiar el estado')
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(async () => {
  rolID.value = localStorage.getItem('usuarioRol') || 2
  usuarioActual.value = localStorage.getItem('usuarioNombre') || 'Usuario Sistema'

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

  cargarStats()
  cargarDepartamentos()
})
</script>