<template>
  <aside class="w-64 bg-white border-r border-slate-100 flex flex-col h-full font-sans overflow-y-auto">
    <!-- Vistas -->
    <div class="p-6 border-b border-slate-100">
      <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Vistas</h2>
      <ul class="space-y-1">
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'todas')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'todas' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <span class="text-sm font-bold">Todas las entradas</span>
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black', activeFilter === 'todas' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">{{ counts.todas }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'misEntradas')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'misEntradas' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <span class="text-sm font-bold">Mis entradas</span>
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black', activeFilter === 'misEntradas' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">{{ counts.misEntradas }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'asignado')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'asignado' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <span class="text-sm font-bold">Asignado a mí</span>
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black', activeFilter === 'asignado' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">{{ counts.asignado }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'sinAsignacion')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'sinAsignacion' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <span class="text-sm font-bold">Sin asignación</span>
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black', activeFilter === 'sinAsignacion' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">{{ counts.sinAsignacion }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Por Estatus -->
    <div class="p-6 border-b border-slate-100">
      <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Por Estatus</h2>
      <ul class="space-y-1">
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'estado-Abierto')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'estado-Abierto' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span class="text-sm font-bold">Abierto</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', activeFilter === 'estado-Abierto' ? 'bg-purple-100 text-purple-700' : 'text-slate-400']">{{ counts.abierto }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'estado-En Progreso')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'estado-En Progreso' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-sm font-bold">En Progreso</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', activeFilter === 'estado-En Progreso' ? 'bg-purple-100 text-purple-700' : 'text-slate-400']">{{ counts.enProgreso }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'estado-Pendiente')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'estado-Pendiente' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span class="text-sm font-bold">Pendiente</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', activeFilter === 'estado-Pendiente' ? 'bg-purple-100 text-purple-700' : 'text-slate-400']">{{ counts.pendiente }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'estado-Resuelto')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'estado-Resuelto' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span class="text-sm font-bold">Resuelto</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', activeFilter === 'estado-Resuelto' ? 'bg-purple-100 text-purple-700' : 'text-slate-400']">{{ counts.resuelto }}</span>
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('filter-changed', 'estado-Cerrado')" :class="['flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors', activeFilter === 'estado-Cerrado' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50']">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span class="text-sm font-bold">Cerrado</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', activeFilter === 'estado-Cerrado' ? 'bg-purple-100 text-purple-700' : 'text-slate-400']">{{ counts.cerrado }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Categorías -->
    <div class="p-6 flex-1">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Categorías</h2>
        <button @click="agregarCategoria" class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer" title="Agregar Categoría">
          <span class="font-bold">+</span>
        </button>
      </div>
      <ul class="space-y-1">
        <li v-for="cat in categoriasLista" :key="cat.id" 
            @click.prevent="$emit('filter-changed', 'categoria-' + cat.nombre)"
            class="group flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
            :class="activeFilter === 'categoria-' + cat.nombre ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'">
          <div class="flex items-center gap-3 flex-1" :class="{ 'opacity-50': !cat.activa }">
            <span class="text-lg">{{ cat.activa ? '📁' : '🔒' }}</span>
            <span class="text-sm font-bold truncate">{{ cat.nombre }}</span>
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black ml-auto', activeFilter === 'categoria-' + cat.nombre ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">{{ getCategoryCount(cat.nombre) }}</span>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button @click.stop="editarCategoria(cat)" class="text-slate-400 hover:text-blue-500" title="Editar">✏️</button>
            <button @click.stop="toggleCategoria(cat)" class="text-slate-400 hover:text-orange-500" :title="cat.activa ? 'Desactivar' : 'Activar'">
              {{ cat.activa ? '👁️' : '🙈' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Props para hacer dinámicos los números y activos en el futuro
const props = defineProps({
  counts: {
    type: Object,
    default: () => ({
      todas: 12,
      misEntradas: 4,
      asignado: 2,
      sinAsignacion: 1,
      abierto: 3,
      enProgreso: 2,
      pendiente: 4,
      resuelto: 1,
      cerrado: 2,
      soporte: 5,
      vacaciones: 3,
      permisos: 4
    })
  },
  activeFilter: {
    type: String,
    default: 'todas'
  },
  ticketsList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-changed', 'categorias-actualizadas'])

const categoriasLista = ref([])

const getCategoryCount = (nombre) => {
  if (!props.ticketsList) return 0;
  return props.ticketsList.filter(t => t.tipo === nombre || t.Categoria === nombre).length;
}

const fetchCategorias = async () => {
  try {
    const res = await axios.get('http://localhost:3007/api/tickets/categorias/lista')
    categoriasLista.value = res.data
    emit('categorias-actualizadas', res.data)
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const agregarCategoria = async () => {
  const nombre = prompt('Ingresa el nombre de la nueva categoría:')
  if (!nombre || !nombre.trim()) return

  try {
    const res = await axios.post('http://localhost:3007/api/tickets/categorias', { nombre: nombre.trim() })
    // Recargar para obtener el estado activa por defecto o hacer push con activa: 1
    fetchCategorias()
  } catch (error) {
    console.error('Error al agregar categoría:', error)
    if (error.response?.data?.error) {
      alert(error.response.data.error)
    } else {
      alert('Hubo un error al agregar la categoría.')
    }
  }
}

const editarCategoria = async (cat) => {
  const nuevoNombre = prompt('Editar nombre de la categoría:', cat.nombre)
  if (!nuevoNombre || !nuevoNombre.trim() || nuevoNombre === cat.nombre) return

  try {
    await axios.put(`http://localhost:3007/api/tickets/categorias/${cat.id}`, {
      nombre: nuevoNombre.trim(),
      activa: cat.activa
    })
    fetchCategorias()
  } catch (error) {
    console.error('Error al editar categoría:', error)
    alert(error.response?.data?.error || 'Error al editar la categoría')
  }
}

const toggleCategoria = async (cat) => {
  const nuevoEstado = !cat.activa
  try {
    await axios.put(`http://localhost:3007/api/tickets/categorias/${cat.id}`, {
      nombre: cat.nombre,
      activa: nuevoEstado
    })
    fetchCategorias()
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error)
    alert('Error al cambiar el estado')
  }
}

onMounted(() => {
  fetchCategorias()
})
</script>
