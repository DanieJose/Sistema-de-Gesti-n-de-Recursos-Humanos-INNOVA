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
            <h1 class="text-3xl font-black text-slate-800 tracking-tight uppercase">Logs de Sistema</h1>
            <p class="text-slate-500 mt-1 font-medium italic">Registro de auditoría y actividades de los usuarios.</p>
          </div>
        </div>
        <div class="w-full">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por usuario, acción o módulo..." 
            class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:italic"
          >
        </div>
      </header>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha y Hora</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalles</th>
                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="border-b border-slate-50">
                <td colspan="7" class="p-10 text-center text-slate-400 italic">Cargando registros de auditoría...</td>
              </tr>
              <tr v-else-if="filteredLogs.length === 0" class="border-b border-slate-50">
                <td colspan="7" class="p-10 text-center text-slate-400 italic">No se encontraron registros.</td>
              </tr>
              <tr v-else v-for="log in filteredLogs" :key="log.id" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td class="p-5 text-xs text-slate-500">#{{ log.id }}</td>
                <td class="p-5 text-sm text-slate-800 font-bold">
                  {{ new Date(log.fecha_creacion).toLocaleString('es-HN') }}
                </td>
                <td class="p-5">
                  <div class="flex flex-col">
                    <span class="font-bold text-blue-600">{{ log.usuario_nombre || 'Sistema' }}</span>
                    <span class="text-xs text-slate-400">{{ log.usuario_correo || 'N/A' }}</span>
                  </div>
                </td>
                <td class="p-5">
                  <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200">
                    {{ log.modulo || 'General' }}
                  </span>
                </td>
                <td class="p-5">
                  <span class="px-3 py-1 text-[10px] font-black uppercase rounded-lg border" :class="getAccionClass(log.accion)">
                    {{ log.accion }}
                  </span>
                </td>
                <td class="p-5 text-sm text-slate-600 max-w-xs truncate" :title="log.detalles">
                  {{ log.detalles || 'Sin detalles' }}
                </td>
                <td class="p-5 text-xs text-slate-400 font-mono">
                  {{ log.ip_address || '0.0.0.0' }}
                </td>
              </tr>
            </tbody>
          </table>
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

const logs = ref([])
const loading = ref(true)
const searchQuery = ref('')

const filteredLogs = computed(() => {
  if (!searchQuery.value) return logs.value;
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return logs.value.filter(log => 
    (log.usuario_nombre && log.usuario_nombre.toLowerCase().includes(lowerCaseQuery)) ||
    (log.accion && log.accion.toLowerCase().includes(lowerCaseQuery)) ||
    (log.modulo && log.modulo.toLowerCase().includes(lowerCaseQuery)) ||
    (log.detalles && log.detalles.toLowerCase().includes(lowerCaseQuery))
  );
})

const getAccionClass = (accion) => {
  const acc = accion.toLowerCase();
  if (acc.includes('crea') || acc.includes('insert') || acc.includes('registr')) {
    return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  } else if (acc.includes('elimina') || acc.includes('delete') || acc.includes('borr') || acc.includes('error')) {
    return 'bg-red-50 text-red-600 border-red-200';
  } else if (acc.includes('actualiza') || acc.includes('edit') || acc.includes('modifica')) {
    return 'bg-blue-50 text-blue-600 border-blue-200';
  } else if (acc.includes('login') || acc.includes('acceso') || acc.includes('sesi')) {
    return 'bg-purple-50 text-purple-600 border-purple-200';
  }
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

const cargarLogs = async () => {
  try {
    loading.value = true
    const res = await axios.get('http://localhost:3000/api/logs')
    logs.value = res.data
  } catch (error) {
    console.error('Error cargando logs:', error)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.clear()
  navigateTo('/login')
}

onMounted(async () => {
  rolID.value = localStorage.getItem('usuarioRol') || 2

  // Solo Super Admin puede ver esto, pero por si acaso validamos
  if (rolID.value != 1) {
    navigateTo('/')
    return
  }

  rolNombre.value = 'Administrador IT'

  try {
    const m = await axios.get(`http://localhost:3000/api/menu/${rolID.value}`)
    menuUsuario.value = m.data
  } catch (e) {
    console.error('Error cargando menú', e)
  }

  cargarLogs()
})
</script>